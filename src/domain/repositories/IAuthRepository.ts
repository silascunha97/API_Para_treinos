import { UsuarioEntity } from '../entities/UsuarioEntity';

export interface IAuthRepository {
  findByEmail(email: string): Promise<UsuarioEntity | null>;
  findById(id: number): Promise<UsuarioEntity | null>;
  create(data: Omit<UsuarioEntity, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<UsuarioEntity>;
  updateRefreshToken?(id: number, refreshTokenHash: string | null): Promise<void>;
}