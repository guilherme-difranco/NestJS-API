// bull-board.module.ts

import { Module, Inject, OnModuleInit } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';          // <= Correto
import { ExpressAdapter } from '@bull-board/express';       // <= Correto
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
// *** Precisamos importar o BullAdapter da @bull-board/api/bullAdapter ***
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'transaction' },
      { name: 'report' },
    ),
  ],
})
export class BullBoardModule implements OnModuleInit {
  static adapter = new ExpressAdapter();
  static bullBoard: ReturnType<typeof createBullBoard>;

  constructor(
    @Inject(getQueueToken('transaction')) private transactionQueue: Queue,
    @Inject(getQueueToken('report')) private reportQueue: Queue,
  ) {}

  onModuleInit() {
    BullBoardModule.adapter.setBasePath('/admin/queues');
    // Aqui, usamos 'BullAdapter' de '@bull-board/api/bullAdapter'
    BullBoardModule.bullBoard = createBullBoard({
      queues: [
        new BullAdapter(this.transactionQueue),
        new BullAdapter(this.reportQueue),
      ],
      serverAdapter: BullBoardModule.adapter,
    });
  }

  static register(app: any) {
    app.use('/admin/queues', BullBoardModule.adapter.getRouter());
  }
}
