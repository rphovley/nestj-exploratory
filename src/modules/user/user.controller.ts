import { Controller, Post, HttpCode, Body, Get, Param, Patch } from '@nestjs/common';
import { BaseController }                                      from '../_shared/controllers/base.controller';
import { UserSaveDto }                                         from './dto/user-save.dto';
import { UserNewPasswordDto }                                  from './dto/user-newpassword.dto';
import { UserService }                                         from './user.service';
import { User }                                                from './user.entity';

@Controller('user')
export class UserController extends BaseController{

    constructor(
        private userService: UserService
    ){
        super();
    }

    @Post()
    @HttpCode(201)
    async create(
        @Body() data: UserSaveDto,
    ): Promise<User>{
        return await this.userService.create(data);
    }

    @Get('confirmation/:code')
    @HttpCode(200)
    async confirmEmailAddress(
        @Param('code') code:string
    ): Promise<boolean>{
        return await this.userService.validateConfirmationToken(code);
    }

    @Patch('/:email/recover')
    @HttpCode(200)
    async recoverPassword(
        @Param('email') email:string
    ): Promise<boolean>{
        const validEmail = await this.userService.emailAddressExists(email);
        if(validEmail){
            this.userService.generateRecoverCode(await this.userService.findUserByEmail(email));
            return true;
        }
        else{
            return true; // It will be return true to avoid to know the emails registered
        }
    }

    @Get('recover/:code')
    @HttpCode(200)
    async confirmRecoverCode(
        @Param('code') code:string
    ): Promise<boolean>{
        const user = await this.userService.validateRecoverToken(code);
        if(user){
            return true;
        }
        else{
            return false;
        }
    }

    @Patch('recover/:code')
    @HttpCode(200)
    async setNewPassword(
        @Param('code') code:string,
        @Body() data:UserNewPasswordDto
    ): Promise<boolean>{
        const user = await this.userService.validateRecoverToken(code);
        if(user){
            const result = await this.userService.setNewPassword(user, data.password);
            if(result){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
}