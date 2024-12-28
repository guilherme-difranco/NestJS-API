import { IsNotEmpty, IsPositive } from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  receiverId: number;

  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
