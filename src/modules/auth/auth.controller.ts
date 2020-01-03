import { Controller, HttpCode, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { BaseController } from '../_shared/controllers/base.controller';
import { UserService } from '../user/user.service';
import { AuthLoginDTO } from './DTO/auth-login.DTO';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController extends BaseController{

    constructor(
        private userService: UserService
    ){
        super();
    }

    @Post('login')
    @HttpCode(200)
    async create(
        @Body() data: AuthLoginDTO,      
    ): Promise<User>{
        const user = await this.userService.login(data);
        if(user){
            if(user.isConfirmed === true){
                return user;
            }
            else{
                throw new HttpException('You need confirm your email address. Please check your inbox and follow the instructions', HttpStatus.UNAUTHORIZED);
            }
        }
        else{
            throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
        }
    }
}