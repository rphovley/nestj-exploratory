import { Module }         from '@nestjs/common';
import { UserController } from './user.controller';
import { BaseModule }     from '../_shared/module/base.module';
import { UserRepository } from './user.repository';
import { TypeOrmModule }  from '@nestjs/typeorm';

@Module({
  imports: [BaseModule, TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
})
export class UserModule {}
