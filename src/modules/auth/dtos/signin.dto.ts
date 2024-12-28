// signin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @ApiProperty({ example: 'joao@example.com' })
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({ example: '123456' })
  password: string;
}
