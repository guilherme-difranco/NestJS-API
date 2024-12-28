import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BullModule } from '@nestjs/bull';
import { ReportModule } from './modules/report/report.module';
import { BullBoardModule } from './modules/bull-board/bull-board.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ReportModule,
    TransactionModule,
    BullBoardModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS ? {} : undefined,
        username: process.env.REDIS_USERNAME,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
