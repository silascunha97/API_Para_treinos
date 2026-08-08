import { CriarContaDTO } from '../../domain/dtos/AuthDTOs';

export interface UsuarioEntity {
  id: number;
  nome: string;
  email: string;
  senha?: string | null;
  idPessoa?: number | null;
}

export interface IUsuarioRepository {
  findByEmail(email: string): Promise<UsuarioEntity | null>;
  findById(id: number): Promise<UsuarioEntity | null>;
  create(data: CriarContaDTO & { senhaHash: string }): Promise<UsuarioEntity>;
}