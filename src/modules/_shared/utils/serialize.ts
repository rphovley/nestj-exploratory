import { Injectable } from "@nestjs/common";

@Injectable()
export class Serialize{
    constructor(){}

    serialize(obj: any): string{
        return JSON.stringify(obj);
    }

    unserialize(serializedObj: string): any{
        return JSON.parse(serializedObj);
    }
}