import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('O valor do depósito deve ser maior que zero.');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: user.balance.plus(amount) },
      });

      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount,
          userId: user.id,
        },
      });

      return {
        message: 'Depósito realizado com sucesso.',
        balance: updatedUser.balance,
        transaction,
      };
    });
  }

  async withdraw(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('O valor do saque deve ser maior que zero.');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }

      if (user.balance.lessThan(amount)) {
        throw new BadRequestException('Saldo insuficiente para saque.');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: user.balance.minus(amount) },
      });

      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.COMPLETED,
          amount,
          userId: user.id,
        },
      });

      return {
        message: 'Saque realizado com sucesso.',
        balance: updatedUser.balance,
        transaction,
      };
    });
  }

  async transfer(userId: number, receiverId: number, amount: number) {
    if (userId === receiverId) {
      throw new BadRequestException('Não é possível transferir para si mesmo.');
    }
    if (amount <= 0) {
      throw new BadRequestException('O valor da transferência deve ser maior que zero.');
    }

    return this.prisma.$transaction(async (tx) => {
      const sender = await tx.user.findUnique({ where: { id: userId } });
      if (!sender) {
        throw new UnauthorizedException('Usuário remetente não encontrado.');
      }

      const receiver = await tx.user.findUnique({ where: { id: receiverId } });
      if (!receiver) {
        throw new BadRequestException('Usuário destinatário não encontrado.');
      }

      if (sender.balance.lessThan(amount)) {
        throw new BadRequestException('Saldo insuficiente para transferência.');
      }

      // Atualiza saldo do remetente
      const updatedSender = await tx.user.update({
        where: { id: userId },
        data: { balance: sender.balance.minus(amount) },
      });

      // Atualiza saldo do destinatário
      const updatedReceiver = await tx.user.update({
        where: { id: receiverId },
        data: { balance: receiver.balance.plus(amount) },
      });

      // Cria transação
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          amount,
          userId: sender.id,
          receiverId: receiver.id,
        },
      });

      return {
        message: 'Transferência realizada com sucesso.',
        senderBalance: updatedSender.balance,
        receiverBalance: updatedReceiver.balance,
        transaction,
      };
    });
  }
}
