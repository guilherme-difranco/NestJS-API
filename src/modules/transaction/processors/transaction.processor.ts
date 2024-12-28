import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionService } from '../services/transaction.service';
import { Logger } from '@nestjs/common';

@Processor('transaction') // nome da fila
export class TransactionProcessor {
  private readonly logger = new Logger(TransactionProcessor.name);

  constructor(private readonly transactionService: TransactionService) {}

  // processa um job do tipo 'deposit'
  @Process('deposit')
  async handleDeposit(job: Job<{ userId: number; amount: number }>) {
    this.logger.log(`Processando depósito: ${JSON.stringify(job.data)}`);
    const { userId, amount } = job.data;
    return this.transactionService.deposit(userId, amount);
  }

  // processa um job do tipo 'withdraw'
  @Process('withdraw')
  async handleWithdraw(job: Job<{ userId: number; amount: number }>) {
    this.logger.log(`Processando saque: ${JSON.stringify(job.data)}`);
    const { userId, amount } = job.data;
    return this.transactionService.withdraw(userId, amount);
  }

  // processa um job do tipo 'transfer'
  @Process('transfer')
  async handleTransfer(job: Job<{ userId: number; receiverId: number; amount: number }>) {
    this.logger.log(`Processando transferência: ${JSON.stringify(job.data)}`);
    const { userId, receiverId, amount } = job.data;
    return this.transactionService.transfer(userId, receiverId, amount);
  }
}
