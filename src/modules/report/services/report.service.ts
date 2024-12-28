import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  // Exemplo: gerar relatório de todas as transações do dia
  async generateDailyReport() {
    const start = new Date();
    start.setUTCHours(0,0,0,0);
    const end = new Date();
    end.setUTCHours(23,59,59,999);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    // Você pode formatar, enviar e-mail, etc.
    return {
      date: new Date().toISOString().split('T')[0],
      totalTransactions: transactions.length,
      transactions,
    };
  }
}
