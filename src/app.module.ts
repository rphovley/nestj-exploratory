import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import * as ormconfig from './ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // Database Settings    
    TypeOrmModule.forRootAsync({
      useFactory: async () => ormconfig
    }),


    // Modules
    AuthModule, 
    UserModule
  ],
  // controllers: [],
})
export class AppModule {}
