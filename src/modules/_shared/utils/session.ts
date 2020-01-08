import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Serialize } from './serialize';

@Injectable({ scope: Scope.REQUEST })
export class Session {
  constructor(
    @Inject(REQUEST) private readonly request,
    private readonly serialize: Serialize,
  ) {}

  getInstance(): any {
    return this.request.session;
  }

  getId(): any {
    const session = this.getInstance();
    return session.sessionId;
  }

  store(key: string, value: any): void {
    const session = this.getInstance();
    session[key] = value;
  }

  get(key: string): any {
    const session = this.getInstance();
    return session[key];
  }

  getObject<T>(key: string): T {
    const session = this.getInstance();
    const sessionValue = this.get(key);
    if (!sessionValue) {
      return null;
    }

    return this.serialize.unserialize(sessionValue) as T;
  }

  destroy(key: string): void {
    const session = this.getInstance();
    session[key] = undefined;
  }
}
