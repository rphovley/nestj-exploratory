import { ConnectionOptions }    from 'typeorm';
import * as dotenv              from 'dotenv';
import * as fs                  from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
const data: any = dotenv.parse(fs.readFileSync('.env'));

// Check typeORM documentation for more information.
const config: TypeOrmModuleOptions [] = [
  {
    type: 'postgres',
    host: data.DATABASE_HOST,
    port: Number(data.DATABASE_PORT),
    username: data.DATABASE_USER,
    password: data.DATABASE_PASSWORD,
    database: 'custom',
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    keepConnectionAlive: true,
    // We are using migrations, synchronize should be set to false.
    synchronize: false,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: false,
    logging: Boolean(data.DATABASE_LOGGING),
    logger: 'file',

    // Allow both start:prod and start:dev to use migrations
    // __dirname is either dist or src folder, meaning either
    // the compiled js in prod or the ts in dev.
    migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    cli: {
      // Location of migration should be inside src folder
      // to be compiled into dist/ folder.
      migrationsDir: 'src/migrations',
    },
  },
  {
    type: 'postgres',
    host: data.DATABASE_HOST,
    port: Number(data.DATABASE_PORT),
    username: data.DATABASE_USER,
    password: data.DATABASE_PASSWORD,
    database: 'postgres',
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    keepConnectionAlive: true,
  // We are using migrations, synchronize should be set to false.
    synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
    migrationsRun: false,
    logging: Boolean(data.DATABASE_LOGGING),
    logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
    migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
  }];

export = config;
