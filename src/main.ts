import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';
import redisStore from 'connect-redis';
import redis from 'redis';

async function bootstrap() {

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			logger: process.env.SERVER_LOGGER
		})
	)

	// const app = await NestFactory.create(AppModule); // Express

	app.useGlobalPipes(new ValidationPipe({
		transform: true
	}));

	// Redis, Session and Cookies
	const redisStoreInstance = redisStore(fastifySession);
	const redisCli = redis.createClient();
	app.register(fastifyCookie);
	app.register(fastifySession, {
		secret: process.env.SESSION_SECRET,
		store: new redisStoreInstance({
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			client: redisCli,
			ttl: process.env.REDIS_TTL
		}),
		cookie: {
			secure: false
		}
	});

	await app.listen(3000);
}
bootstrap();
