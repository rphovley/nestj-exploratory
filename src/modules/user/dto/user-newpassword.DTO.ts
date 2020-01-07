import { IsNotEmpty } from 'class-validator';

export class UserNewPasswordDto {
  @IsNotEmpty()
  password: string;
}
