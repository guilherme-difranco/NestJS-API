// src/modules/transaction/controllers/transaction.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { DepositDto } from '../dtos/deposit.dto';
import { WithdrawDto } from '../dtos/withdraw.dto';
import { TransferDto } from '../dtos/transfer.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

// Mock do Guard JwtAuthGuard
const mockJwtAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true), // Permite todos os testes
};

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionQueue: Queue;

  // Mock da Queue do BullMQ
  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: getQueueToken('transaction'), useValue: mockQueue },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionQueue = module.get<Queue>(getQueueToken('transaction'));

    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('deposit', () => {
    it('should add a deposit job to the queue', async () => {
      const user = { userId: 1 };
      const depositDto: DepositDto = { amount: 100 };

      await controller.deposit(user, depositDto);

      expect(transactionQueue.add).toHaveBeenCalledWith('deposit', {
        userId: 1,
        amount: 100,
      });
    });

    it('should throw an exception if adding job fails', async () => {
      const user = { userId: 1 };
      const depositDto: DepositDto = { amount: 100 };
      mockQueue.add.mockRejectedValue(new BadRequestException('Erro ao adicionar job'));

      await expect(controller.deposit(user, depositDto)).rejects.toThrow(BadRequestException);
      expect(transactionQueue.add).toHaveBeenCalledWith('deposit', {
        userId: 1,
        amount: 100,
      });
    });
  });

  describe('withdraw', () => {
    it('should add a withdraw job to the queue', async () => {
      const user = { userId: 1 };
      const withdrawDto: WithdrawDto = { amount: 50 };

      await controller.withdraw(user, withdrawDto);

      expect(transactionQueue.add).toHaveBeenCalledWith('withdraw', {
        userId: 1,
        amount: 50,
      });
    });

    it('should throw an exception if adding job fails', async () => {
      const user = { userId: 1 };
      const withdrawDto: WithdrawDto = { amount: 50 };
      mockQueue.add.mockRejectedValue(new BadRequestException('Erro ao adicionar job'));

      await expect(controller.withdraw(user, withdrawDto)).rejects.toThrow(BadRequestException);
      expect(transactionQueue.add).toHaveBeenCalledWith('withdraw', {
        userId: 1,
        amount: 50,
      });
    });
  });

  describe('transfer', () => {
    it('should add a transfer job to the queue', async () => {
      const user = { userId: 1 };
      const transferDto: TransferDto = { receiverId: 2, amount: 75 };

      await controller.transfer(user, transferDto);

      expect(transactionQueue.add).toHaveBeenCalledWith('transfer', {
        userId: 1,
        receiverId: 2,
        amount: 75,
      });
    });

    it('should throw an exception if adding job fails', async () => {
      const user = { userId: 1 };
      const transferDto: TransferDto = { receiverId: 2, amount: 75 };
      mockQueue.add.mockRejectedValue(new BadRequestException('Erro ao adicionar job'));

      await expect(controller.transfer(user, transferDto)).rejects.toThrow(BadRequestException);
      expect(transactionQueue.add).toHaveBeenCalledWith('transfer', {
        userId: 1,
        receiverId: 2,
        amount: 75,
      });
    });
  });
});
