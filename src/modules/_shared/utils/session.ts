import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable({scope: Scope.REQUEST})
export class Session{
    constructor(
        @Inject(REQUEST) private readonly request
    ){
        
    }

    getInstance(): any{
        return this.request.session;
    }

    getId(): any{
        const session = this.getInstance();
        return session.sessionId;
    }

    store(key: string, value: any): void{
        const session = this.getInstance();
        session[key] = value;
    }

    get(key: string): any{
        const session = this.getInstance();
        return session[key];
    }

    destroy(key: string): void{
        const session = this.getInstance();
        session[key] = undefined;
    }
}