import { IUsuarioRepository, UsuarioEntity } from '../../../domain/repositories/IUsuarioRepository';

export class ObterUsuarioLogadoUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(idUsuario: number): Promise<UsuarioEntity | null> {
    return await this.usuarioRepository.findById(idUsuario);
  }
}
