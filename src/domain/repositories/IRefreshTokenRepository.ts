export interface RefreshTokenEntity {
  id: string;
  tokenHash: string;
  idUsuario: number;
  expiraEm: Date;
  revogado: boolean;
}

export interface IRefreshTokenRepository {
  create(idUsuario: number, tokenHash: string, expiraEm: Date): Promise<RefreshTokenEntity>;
  findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
  revokeByUserId(idUsuario: number): Promise<void>;
}