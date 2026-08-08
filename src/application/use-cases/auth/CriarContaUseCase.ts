import { CriarContaDTO, AuthResponseDTO } from '../../../domain/dtos/AuthDTOs';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { IPasswordHasher } from '../../../domain/providers/IPasswordHasher';
import { ITokenProvider } from '../../../domain/providers/ITokenProvider';

export class CriarContaUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
    private tokenProvider: ITokenProvider
  ) {}

  async execute(dto: CriarContaDTO): Promise<AuthResponseDTO> {
    // 1. Validar duplicidade de e-mail
    const usuarioExistente = await this.usuarioRepository.findByEmail(dto.email);
    if (usuarioExistente) {
      throw new Error('E-mail já cadastrado no sistema.');
    }

    // 2. Hash da senha
    const senhaHash = await this.passwordHasher.hash(dto.senha);

    // 3. Persistir usuário
    const novoUsuario = await this.usuarioRepository.create({
      ...dto,
      senhaHash,
    });

    // 4. Gerar Tokens
    const payload = {
      sub: novoUsuario.id,
      email: novoUsuario.email,
      ...(novoUsuario.idPessoa !== null && novoUsuario.idPessoa !== undefined
        ? { idPessoa: novoUsuario.idPessoa }
        : {}),
    };

    const accessToken = this.tokenProvider.generateAccessToken(payload);
    const refreshToken = this.tokenProvider.generateRefreshToken(payload);

    // 5. Salvar Refresh Token no Banco (expira em 7 dias)
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    // Para segurança, armazenamos o hash do Refresh Token
    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);
    await this.refreshTokenRepository.create(novoUsuario.id, refreshTokenHash, expiraEm);

    return {
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        idPessoa: novoUsuario.idPessoa === undefined ? null : novoUsuario.idPessoa,
      },
      accessToken,
      refreshToken,
    };
  }
}