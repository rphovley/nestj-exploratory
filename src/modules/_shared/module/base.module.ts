import { Module }             from '@nestjs/common';
import { LocalPassportGuard } from '../../../guards/local-passport.guard';
import { UserService }        from '../../user/user.service';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { User }               from '../../user/user.entity';
import { Session }            from '../utils/session';
import { Serialize }          from '../utils/serialize';
import { LoggerService }      from '../services/logger.service';
import { TenancyModule }      from "./tenancy.module";

@Module({
  imports: [TypeOrmModule.forFeature([User], 'custom'), TypeOrmModule.forFeature([User], 'postgres'), TenancyModule],
  exports: [TypeOrmModule.forFeature([User], 'custom'), TypeOrmModule.forFeature([User], 'postgres'), UserService, Session, Serialize, LoggerService],
  providers: [UserService, LocalPassportGuard, Session, Serialize, LoggerService],
})
export class BaseModule {}
