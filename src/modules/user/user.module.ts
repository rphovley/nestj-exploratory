import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BaseModule } from '../_shared/module/base.module';

@Module({
  imports: [BaseModule],
  controllers: [UserController],
})
export class UserModule {}
