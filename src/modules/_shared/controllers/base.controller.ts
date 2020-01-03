import { UseFilters, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http.exception-filter';

@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController{

}
