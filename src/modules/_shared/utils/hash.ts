import bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';

export class Hash {
  static async create(value: string, salt: number = 10): Promise<string> {
    return await bcryptjs.hash(value, salt);
  }

  static async match(value: string, hashedValue: string): Promise<boolean> {
    return await bcryptjs.compare(value, hashedValue);
  }

  static createRandomSha1Hash(bytesNumber: number = 48): string {
    return crypto.randomBytes(bytesNumber).toString('hex');
  }
}
