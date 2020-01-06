import { Injectable } from "@nestjs/common";
import serialize from 'node-serialize';

@Injectable()
export class Serialize{
    constructor(){}

    serialize(obj: any): string{
        return serialize.serialize(obj);
    }

    unserialize(serializedObj: string): any{
        return serialize.unserialize(serializedObj);
    }
}