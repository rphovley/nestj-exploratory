import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
	controllers: [AuthController],
	providers: [UserService],
	imports: [
		TypeOrmModule.forFeature([User])
	]
})
export class AuthModule {}