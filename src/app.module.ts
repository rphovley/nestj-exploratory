import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './ormconfig';
import LoadModules from './modules'; // tslint:disable-line

// read all module folders and load all available modules
const modules: DynamicModule[] = LoadModules();

// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot(),

    // Database Settings
    TypeOrmModule.forRootAsync({
      useFactory: async () => ormconfig,
    }),
    ...modules,
  ],
  // controllers: [],
})
export class AppModule {}
