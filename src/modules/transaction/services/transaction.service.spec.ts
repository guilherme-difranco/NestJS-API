// src/modules/transaction/services/transaction.service.spec.ts

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/database/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  // Mock functions for tx
  let mockFindUnique: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockCreate: jest.Mock;

  // Mock of PrismaService
  const mockPrismaService = {
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Initialize mock functions
    mockFindUnique = jest.fn();
    mockUpdate = jest.fn();
    mockCreate = jest.fn();

    // Define the mock implementation for $transaction
    mockPrismaService.$transaction.mockImplementation(async (fn: Function) => {
      const mockTx = {
        user: {
          findUnique: mockFindUnique,
          update: mockUpdate,
        },
        transaction: {
          create: mockCreate,
        },
      };
      return fn(mockTx);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('deposit', () => {
    it('should throw BadRequestException if amount <= 0', async () => {
      await expect(service.deposit(1, 0)).rejects.toThrow(BadRequestException);
      await expect(service.deposit(1, -100)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(service.deposit(1, 100)).rejects.toThrow(UnauthorizedException);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should perform deposit successfully', async () => {
      const mockUser = { id: 1, balance: { plus: jest.fn().mockReturnValue(200) } };
      const mockUpdatedUser = { balance: 200 };
      const mockTransaction = {
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        amount: 100,
        userId: 1,
      };

      mockFindUnique.mockResolvedValue(mockUser);
      mockUpdate.mockResolvedValue(mockUpdatedUser);
      mockCreate.mockResolvedValue(mockTransaction);

      const result = await service.deposit(1, 100);

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUser.balance.plus).toHaveBeenCalledWith(100);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: 200 },
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount: 100,
          userId: 1,
        },
      });
      expect(result).toEqual({
        message: 'Depósito realizado com sucesso.',
        balance: 200,
        transaction: mockTransaction,
      });
    });
  });

  describe('withdraw', () => {
    it('should throw BadRequestException if amount <= 0', async () => {
      await expect(service.withdraw(1, 0)).rejects.toThrow(BadRequestException);
      await expect(service.withdraw(1, -50)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(service.withdraw(1, 50)).rejects.toThrow(UnauthorizedException);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const mockUser = { id: 1, balance: { lessThan: jest.fn().mockReturnValue(true) } };

      mockFindUnique.mockResolvedValue(mockUser);

      await expect(service.withdraw(1, 100)).rejects.toThrow(BadRequestException);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUser.balance.lessThan).toHaveBeenCalledWith(100);
    });

    it('should perform withdraw successfully', async () => {
      const mockUser = { id: 1, balance: { lessThan: jest.fn().mockReturnValue(false), minus: jest.fn().mockReturnValue(50) } };
      const mockUpdatedUser = { balance: 50 };
      const mockTransaction = {
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.COMPLETED,
        amount: 50,
        userId: 1,
      };

      mockFindUnique.mockResolvedValue(mockUser);
      mockUser.balance.lessThan.mockReturnValue(false);
      mockUser.balance.minus.mockReturnValue(50);
      mockUpdate.mockResolvedValue(mockUpdatedUser);
      mockCreate.mockResolvedValue(mockTransaction);

      const result = await service.withdraw(1, 50);

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUser.balance.lessThan).toHaveBeenCalledWith(50);
      expect(mockUser.balance.minus).toHaveBeenCalledWith(50);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: 50 },
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.COMPLETED,
          amount: 50,
          userId: 1,
        },
      });
      expect(result).toEqual({
        message: 'Saque realizado com sucesso.',
        balance: 50,
        transaction: mockTransaction,
      });
    });
  });

  describe('transfer', () => {
    it('should throw BadRequestException if transferring to self', async () => {
        await expect(service.transfer(1, 1, 100)).rejects.toThrow(BadRequestException);
      });
  
      it('should throw BadRequestException if amount <= 0', async () => {
        await expect(service.transfer(1, 2, 0)).rejects.toThrow(BadRequestException);
        await expect(service.transfer(1, 2, -100)).rejects.toThrow(BadRequestException);
      });
  
      it('should throw UnauthorizedException if sender not found', async () => {
        mockFindUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 2, balance: { plus: jest.fn() } });
  
        await expect(service.transfer(1, 2, 100)).rejects.toThrow(UnauthorizedException);
  
        expect(mockFindUnique).toHaveBeenNthCalledWith(1, { where: { id: 1 } });
      });
  
      it('should throw BadRequestException if receiver not found', async () => {
        const mockSender = { id: 1, balance: { lessThan: jest.fn().mockReturnValue(false), minus: jest.fn().mockReturnValue(50) } };
  
        mockFindUnique.mockResolvedValueOnce(mockSender).mockResolvedValueOnce(null);
  
        await expect(service.transfer(1, 2, 100)).rejects.toThrow(BadRequestException);
  
        expect(mockFindUnique).toHaveBeenNthCalledWith(1, { where: { id: 1 } });
        expect(mockFindUnique).toHaveBeenNthCalledWith(2, { where: { id: 2 } });
      });
  
      it('should throw BadRequestException if sender has insufficient balance', async () => {
        const mockSender = { id: 1, balance: { lessThan: jest.fn().mockReturnValue(true) } };
        const mockReceiver = { id: 2, balance: { plus: jest.fn().mockReturnValue(200) } };
  
        mockFindUnique.mockResolvedValueOnce(mockSender).mockResolvedValueOnce(mockReceiver);
  
        await expect(service.transfer(1, 2, 100)).rejects.toThrow(BadRequestException);
  
        expect(mockFindUnique).toHaveBeenNthCalledWith(1, { where: { id: 1 } });
        expect(mockFindUnique).toHaveBeenNthCalledWith(2, { where: { id: 2 } });
        expect(mockSender.balance.lessThan).toHaveBeenCalledWith(100);
      });
    it('should perform transfer successfully', async () => {
      const mockSender = {
        id: 1,
        balance: {
          lessThan: jest.fn().mockReturnValue(false),
          minus: jest.fn().mockReturnValue(50), // Corrigido para retornar 50
        },
      };
      const mockReceiver = {
        id: 2,
        balance: {
          plus: jest.fn().mockReturnValue(150),
        },
      };
      const mockUpdatedSender = { balance: 50 };
      const mockUpdatedReceiver = { balance: 150 };
      const mockTransaction = {
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        amount: 100,
        userId: 1,
        receiverId: 2,
      };

      mockFindUnique.mockResolvedValueOnce(mockSender).mockResolvedValueOnce(mockReceiver);
      mockSender.balance.lessThan.mockReturnValue(false);
      mockSender.balance.minus.mockReturnValue(50); // Corrigido para retornar 50
      mockReceiver.balance.plus.mockReturnValue(150);
      mockUpdate.mockResolvedValueOnce(mockUpdatedSender).mockResolvedValueOnce(mockUpdatedReceiver);
      mockCreate.mockResolvedValue(mockTransaction);

      const result = await service.transfer(1, 2, 100);

      expect(mockFindUnique).toHaveBeenNthCalledWith(1, { where: { id: 1 } });
      expect(mockFindUnique).toHaveBeenNthCalledWith(2, { where: { id: 2 } });

      expect(mockSender.balance.lessThan).toHaveBeenCalledWith(100);
      expect(mockSender.balance.minus).toHaveBeenCalledWith(100);
      expect(mockReceiver.balance.plus).toHaveBeenCalledWith(100);

      expect(mockUpdate).toHaveBeenNthCalledWith(1, {
        where: { id: 1 },
        data: { balance: 50 },
      });
      expect(mockUpdate).toHaveBeenNthCalledWith(2, {
        where: { id: 2 },
        data: { balance: 150 },
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          type: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          amount: 100,
          userId: 1,
          receiverId: 2,
        },
      });

      expect(result).toEqual({
        message: 'Transferência realizada com sucesso.',
        senderBalance: 50,
        receiverBalance: 150,
        transaction: mockTransaction,
      });
    });
  });
});