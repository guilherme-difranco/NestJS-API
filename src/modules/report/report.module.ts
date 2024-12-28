import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReportService } from './services/report.service';
import { ReportProcessor } from './processors/report.processor';
import { ReportController } from './controllers/report.controller'; // <-- import do controller

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'report',
    }),
  ],
  providers: [ReportService, ReportProcessor],
  controllers: [ReportController], // <-- registra o controller
  exports: [ReportService],
})
export class ReportModule {}
