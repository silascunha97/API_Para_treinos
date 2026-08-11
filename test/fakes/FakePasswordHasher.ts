import { IPasswordHasher } from '../../src/domain/providers/IPasswordHasher';

export class FakePasswordHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    return `${plain}_hashed`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return `${plain}_hashed` === hashed;
  }
}