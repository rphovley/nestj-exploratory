import { Module }         from '@nestjs/common';
import { UserController } from './user.controller';
import { BaseModule }     from '../_shared/module/base.module';
import { TypeOrmModule }  from '@nestjs/typeorm';
import { TenancyModule }  from "../_shared/module/tenancy.module";

@Module({
  imports: [BaseModule],
  controllers: [UserController],
  providers: [TenancyModule]
})
export class UserModule {}
