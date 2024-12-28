// signup.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @Length(3, 50)
  @ApiProperty({ example: 'João' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'joao@example.com' })
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({ example: '123456' })
  password: string;
}
