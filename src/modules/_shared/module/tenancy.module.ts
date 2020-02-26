import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnection } from 'typeorm';
import tenants           from './tenants';
function resolveConnection(tenancyId: string): string | null {
  // @ts-ignore
  return tenants.some(x => x.id === tenancyId) ? tenancyId : null;
}

const connectionFactory = {
  provide: 'CONNECTION',
  scope: Scope.REQUEST,
  useFactory: (req) => {
    const tenantId = resolveConnection(req.headers.tenantid);
    return getConnection(tenantId);
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: ['CONNECTION'],
})
export class TenancyModule {}
