import { IsNotEmpty, IsEmail } from "class-validator";

export class AuthLoginDTO {    
    
    @IsNotEmpty()
    @IsEmail()
    username:string;
    
    @IsNotEmpty()
    password:string;
}