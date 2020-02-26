import {
  Controller ,
  Post ,
  HttpCode ,
  Body ,
  Get ,
  Param ,
  Patch ,
  BadRequestException , Scope , Injectable ,
}                                                     from '@nestjs/common';
import { BaseController }                             from '../_shared/controllers/base.controller';
import { UserSaveDto }                                from './dto/user-save.dto';
import { UserNewPasswordDto }                         from './dto/user-newpassword.dto';
import { UserService }                                from './user.service';
import { User }                                       from './user.entity';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@Injectable({ scope: Scope.REQUEST })
export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    type: User,
    description: 'The user has been successfully created',
  })
  async create(@Body() data: UserSaveDto): Promise<User> {
    return await this.userService.create(data);
  }
  @Get()
  @HttpCode(200)
  async getAll(): Promise<User[]> {
    return await this.userService.find();
  }

  @Patch('/:email/recover')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The password recovery process has been started',
  })
  async recoverPassword(@Param('email') email: string): Promise<boolean> {
    const validEmail = await this.userService.emailAddressExists(email);
    if (!validEmail) {
      return true;
    }

    this.userService.generateRecoverCode(
      await this.userService.findUserByEmail(email),
    );
    return true;
  }

  @Get('recover/:code')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The recovery code is valid',
  })
  async confirmRecoverCode(@Param('code') code: string): Promise<boolean> {
    const user = await this.userService.validateRecoverToken(code);
    if (!user) {
      throw new BadRequestException();
    }

    return true;
  }

  @Patch('recover/:code')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The password has been updated',
  })
  async setNewPassword(
    @Param('code') code: string,
    @Body() data: UserNewPasswordDto,
  ): Promise<boolean> {
    const user = await this.userService.validateRecoverToken(code);
    if (!user) {
      throw new BadRequestException();
    }

    const result = await this.userService.setNewPassword(user, data.password);
    if (!result) {
      throw new BadRequestException();
    }

    return true;
  }
}
