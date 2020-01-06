import { IsNotEmpty } from 'class-validator';

export class UserNewPasswordDTO{
    @IsNotEmpty()
    password: string;
}