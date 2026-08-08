export interface TokenPayload {
  sub: number;       // idUsuario
  idPessoa?: number;
  email: string;
}

export interface ITokenProvider {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload | null;
  verifyRefreshToken(token: string): TokenPayload | null;
}