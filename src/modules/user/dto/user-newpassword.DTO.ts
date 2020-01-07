import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserNewPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
