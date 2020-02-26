import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCompress from 'fastify-compress';
import fastifyHelmet from 'fastify-helmet';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';
import fastifyCors from 'fastify-cors';
import connectRedis from 'connect-redis';
import redis from 'redis';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from './modules/_shared/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: +process.env.BODY_LIMIT,
      logger: process.env.SERVER_LOGGER,
    }),
  );

  // Logger
  app.useLogger(app.get(LoggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.register(fastifyRateLimit, {
    max: +process.env.MAX_RATE_REQUESTS,
    ban: +process.env.TIMES_BAN_RATE_REQUESTS,
    timeWindow: +process.env.TIME_WINDOW_RATE_LIMIT,
  });

  app.register(fastifyCors, {
    allowedHeaders: process.env.ALLOWED_HEADERS.split(','),
    credentials: true,
    methods: process.env.ALLOWED_METHODS.split(','),
    origin: process.env.ALLOWED_ORIGINS.split(','),
    preflightContinue: false,
  });

  app.register(fastifyHelmet, { hidePoweredBy: true });
  app.register(fastifyCompress);


  // Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Ursula API')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(3000);
  await app.listen(+process.env.SERVER_PORT);
}

bootstrap();
