import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './ormconfig';
import LoadModules from './modules'; // tslint:disable-line
import { LoggerService } from './modules/_shared/services/logger.service';

// read all module folders and load all available modules
const modules: DynamicModule[] = LoadModules();

// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot(),
    // Database Settings
    TypeOrmModule.forRootAsync({
      name: 'custom',
      useFactory: async () => ormconfig[0] as any,
    }),
    TypeOrmModule.forRootAsync({
      name: 'postgres',
      useFactory: async () => ormconfig[1] as any,
    }),
    ...modules,
  ],
  providers: [],
})
export class AppModule {}
