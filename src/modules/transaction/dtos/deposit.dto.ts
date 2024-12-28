import { IsNumber, IsPositive } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @IsPositive({ message: 'O valor do depósito deve ser maior que zero.' })
  amount: number;
}
