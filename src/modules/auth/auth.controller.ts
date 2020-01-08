import { Controller, HttpCode, Post, Body, HttpException, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { UserService }                                                                          from '../user/user.service';
import { AuthLoginDto }                                                                         from './dto/auth-login.dto';
import { User }                                                                                 from '../user/user.entity';
import { Session }                                                                              from '../_shared/utils/session';
import  { LocalPassportGuard }                                                                  from '../../guards/local-passport.guard';

@Controller('auth')
export class AuthController {
  constructor(
        private readonly session: Session,
        private readonly userService: UserService,
    ) {
  }

  @Post('login')
  @HttpCode(200)
  async create(@Body() data: AuthLoginDto): Promise<User> {
    const user = await this.userService.login(data);
    if (user) {
      if (!user.isConfirmed) {
        throw new HttpException(
          `You need confirm your email address.
          Please check your inbox and follow the instructions`,
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.userService.authenticateSession(user);
      return user;
    } else {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(LocalPassportGuard)
  @Get('me')
  @HttpCode(200)
  async me(@Request() req): Promise<User> {
    return new User(req.user);
  }

  @UseGuards(LocalPassportGuard)
  @Get('logout')
  @HttpCode(200)
  async logout(): Promise<boolean> {
    this.userService.logout();
    return true;
  }
}
