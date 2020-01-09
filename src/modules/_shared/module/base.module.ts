import { Module }             from '@nestjs/common';
import { LocalPassportGuard } from '../../../guards/local-passport.guard';
import { UserService }        from '../../user/user.service';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { User }               from '../../user/user.entity';
import { Session }            from '../utils/session';
import { Serialize }          from '../utils/serialize';
import { LoggerService } from '../services/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule.forFeature([User]), UserService, Session, Serialize, LoggerService],
  providers: [UserService, LocalPassportGuard, Session, Serialize, LoggerService],
})
export class BaseModule {}
