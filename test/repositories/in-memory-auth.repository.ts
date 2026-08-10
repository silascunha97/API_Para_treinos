import { IAuthRepository} from '../../src/domain/repositories/IAuthRepository';
import { UsuarioEntity } from '../../src/domain/entities/UsuarioEntity';

export class InMemoryAuthRepository implements IAuthRepository {
  public items: UsuarioEntity[] = [];

  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const usuario = this.items.find((item) => item.email === email);
    return usuario ?? null;
  }

  async findById(id: number): Promise<UsuarioEntity | null> {
    const usuario = this.items.find((item) => item.id === id);
    return usuario ?? null;
  }

  async create(data: Omit<UsuarioEntity, 'id'>): Promise<UsuarioEntity> {
    const novoUsuario: UsuarioEntity = {
      id: this.items.length + 1,
      nome: data.nome,
      email: data.email,
      senhaHash: data.senhaHash,
      criadoEm: new Date(),
    };

    this.items.push(novoUsuario);
    return novoUsuario;
  }
}