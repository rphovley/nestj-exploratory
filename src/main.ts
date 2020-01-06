import { NestFactory , Reflector }                 from '@nestjs/core';
import { FastifyAdapter , NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule }                               from './app.module';
import { ValidationPipe }                          from '@nestjs/common';
import fastifyCompress                             from 'fastify-compress';
import fastifyHelmet                                      from 'fastify-helmet';
import fastifyRateLimit                            from 'fastify-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
        AppModule ,
        new FastifyAdapter({
          bodyLimit: 10240,
          logger : process.env.SERVER_LOGGER,
        }),
    );

  app.useGlobalPipes(new ValidationPipe({
    transform : true,
  }));

  app.register(fastifyRateLimit, {
    max: 100,
    ban: 10,
    timeWindow: 60 * 1000,
  });

  app.register(require('fastify-cors'), {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: ['http://localhost:8080', 'https://ursul.us'],
    preflightContinue: false,
  });
  app.register(fastifyHelmet, { hidePoweredBy: true });
  app.register(fastifyCompress);
  await app.listen(3000);
}

bootstrap();
