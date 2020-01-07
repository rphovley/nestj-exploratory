import { Controller, HttpCode, Post, Body, HttpException, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { BaseController }                                                                       from '../_shared/controllers/base.controller';
import { UserService }                                                                          from '../user/user.service';
import { AuthLoginDto }                                                                         from './dto/auth-login.dto';
import { User }                                                                                 from '../user/user.entity';
import { Session }                                                                              from '../_shared/utils/session';
import  localPassportGuard                                                                      from 'src/guards/local-passport.guard';

@Controller('auth')
export class AuthController extends BaseController{

  constructor(
        private readonly session: Session,
        private readonly userService: UserService,
    ) {
    super();
  }

  @Post('login')
    @HttpCode(200)
    async create(
        @Body() data: AuthLoginDto,
    ): Promise<User> {
    const user = await this.userService.login(data);
    if (user) {
      if (user.isConfirmed === true) {
        await this.userService.authenticateSession(user);
        return user;
      }

      throw new HttpException('You need confirm your email address. Please check your inbox and follow the instructions' , HttpStatus.UNAUTHORIZED);

    }
    throw new HttpException('Invalid username or password' , HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(localPassportGuard)
    @Get('me')
    @HttpCode(200)
    async me(@Request() req): Promise<User> {
    return new User(req.user);
  }

  @UseGuards(localPassportGuard)
    @Get('logout')
    @HttpCode(200)
    async logout(): Promise<boolean> {
    this.userService.logout();
    return true;
  }

}
