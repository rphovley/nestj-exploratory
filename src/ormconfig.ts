import {ConnectionOptions} from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
const data: any = dotenv.parse(fs.readFileSync(`.env`));


// Check typeORM documentation for more information.
const config: ConnectionOptions = {
	type: 'postgres',
	host: data.DATABASE_HOST,
	port: Number(data.DATABASE_PORT),
	username: data.DATABASE_USER,
	password: data.DATABASE_PASSWORD,
	database: 'ms-auth',
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	
	// We are using migrations, synchronize should be set to false.
	synchronize: false,
	
	// Run migrations automatically,
	// you can disable this if you prefer running migration manually.
	migrationsRun: true,
	logging: Boolean(data.DATABASE_LOGGING),
	logger: 'file',
	
	// Allow both start:prod and start:dev to use migrations
	// __dirname is either dist or src folder, meaning either
	// the compiled js in prod or the ts in dev.
	migrations: [__dirname + 'src/migrations/**/*{.ts,.js}'],
	cli: {
		// Location of migration should be inside src folder
		// to be compiled into dist/ folder.
		migrationsDir: 'src/migrations',
	},
};

export = config;