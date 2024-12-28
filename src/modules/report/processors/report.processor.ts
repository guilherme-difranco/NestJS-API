import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReportService } from '../services/report.service';
import { Logger } from '@nestjs/common';

@Processor('report') // fila 'report'
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(private readonly reportService: ReportService) {}

  @Process('dailyReport')
  async handleDailyReport(job: Job) {
    this.logger.log('Gerando relatório diário...');
    const report = await this.reportService.generateDailyReport();
    this.logger.log(`Relatório gerado: ${JSON.stringify(report)}`);
    // Aqui você pode salvar em um arquivo, mandar e-mail, etc.
  }
}
