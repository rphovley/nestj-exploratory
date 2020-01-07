import { IsNotEmpty, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<AuthLoginDto>) {
    Object.assign(this, partial);
  }
}
