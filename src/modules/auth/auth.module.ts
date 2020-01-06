import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BaseModule } from '../_shared/module/base.module';

@Module({
	imports: [
		BaseModule
	],
	controllers: [AuthController]
})
export class AuthModule {}