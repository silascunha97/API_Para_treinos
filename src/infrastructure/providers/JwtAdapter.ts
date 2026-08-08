import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenProvider, TokenPayload } from '../../domain/providers/ITokenProvider';

export class JwtAdapter implements ITokenProvider {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
    private readonly accessExpiresIn: SignOptions['expiresIn'] = '15m',
    private readonly refreshExpiresIn: SignOptions['expiresIn'] = '7d'
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {};
    if (this.accessExpiresIn) {
      options.expiresIn = this.accessExpiresIn;
    }
    return jwt.sign(payload, this.accessSecret, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = {};
    if (this.refreshExpiresIn) {
      options.expiresIn = this.refreshExpiresIn;
    }
    return jwt.sign(payload, this.refreshSecret, options);
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as unknown as TokenPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as unknown as TokenPayload;
    } catch {
      return null;
    }
  }
}