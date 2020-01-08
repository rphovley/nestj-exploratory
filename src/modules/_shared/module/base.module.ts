import { Module }             from '@nestjs/common';
import { LocalPassportGuard } from '../../../guards/local-passport.guard';
import { UserService }        from '../../user/user.service';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { User }               from '../../user/user.entity';
import { Session }            from '../utils/session';
import { Serialize }          from '../utils/serialize';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule.forFeature([User]), UserService, Session, Serialize],
  providers: [UserService, LocalPassportGuard, Session, Serialize],
})
export class BaseModule {}
