import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

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

	await app.listen(3000);
}
bootstrap();
