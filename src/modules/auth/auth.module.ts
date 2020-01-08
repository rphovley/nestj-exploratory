import { Module }         from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BaseModule }     from '../_shared/module/base.module';
import { UserModule }     from '../user/user.module';

@Module({
  imports: [BaseModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
