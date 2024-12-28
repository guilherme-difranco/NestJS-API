import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/auth.decorator';
import { DepositDto } from '../dtos/deposit.dto';
import { WithdrawDto } from '../dtos/withdraw.dto';
import { TransferDto } from '../dtos/transfer.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transaction')
@ApiBearerAuth()
@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    @InjectQueue('transaction') private transactionQueue: Queue,
  ) {}

  @Post('deposit')
  async deposit(@CurrentUser() user: any, @Body() dto: DepositDto) {
    // Adiciona job na fila
    await this.transactionQueue.add('deposit', {
      userId: user.userId,
      amount: dto.amount,
    });
    return { message: 'Depósito em processamento.' };
  }

  @Post('withdraw')
  async withdraw(@CurrentUser() user: any, @Body() dto: WithdrawDto) {
    await this.transactionQueue.add('withdraw', {
      userId: user.userId,
      amount: dto.amount,
    });
    return { message: 'Saque em processamento.' };
  }

  @Post('transfer')
  async transfer(@CurrentUser() user: any, @Body() dto: TransferDto) {
    await this.transactionQueue.add('transfer', {
      userId: user.userId,
      receiverId: dto.receiverId,
      amount: dto.amount,
    });
    return { message: 'Transferência em processamento.' };
  }
}
