import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionProcessor } from './processors/transaction.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transaction',
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionProcessor],
  exports: [TransactionService],
})
export class TransactionModule {}
