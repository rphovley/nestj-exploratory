import { UseFilters , ClassSerializerInterceptor , UseInterceptors , UseGuards } from '@nestjs/common';
import { HttpExceptionFilter }                                                   from '../../../filters/http.exception-filter';
import { LocalPassportGuard }                                                    from '../../../guards/local-passport.guard';

@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController {}
