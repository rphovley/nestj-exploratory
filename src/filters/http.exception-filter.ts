import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express'; // Used when express

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = (exception.getResponse() as HttpException).message || exception?.message?.error || exception?.message;

    response
      .status(status)
      .send({
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.path,
      });
  }
}
