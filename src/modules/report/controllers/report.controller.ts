import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth() // Exibe no Swagger que usa token Bearer
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Gera um relatório diário agora mesmo' })
  async generateDailyReport() {
    return this.reportService.generateDailyReport();
  }
}
