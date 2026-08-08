import { AutenticarDTO, AuthResponseDTO } from '../../../domain/dtos/AuthDTOs';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { IPasswordHasher } from '../../../domain/providers/IPasswordHasher';
import { ITokenProvider } from '../../../domain/providers/ITokenProvider';

export class AutenticarComSenhaUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
    private tokenProvider: ITokenProvider
  ) {}

  async execute(dto: AutenticarDTO): Promise<AuthResponseDTO> {
    // 1. Buscar usuário por e-mail
    const usuario = await this.usuarioRepository.findByEmail(dto.email);
    if (!usuario) {
      throw new Error('Credenciais inválidas.');
    }

    // 2. Verificar se a conta tem senha definida (ex: contas criadas via Google não possuem senha)
    if (!usuario.senha) {
      throw new Error('Esta conta foi criada via login social. Utilize o login do Google.');
    }

    // 3. Validar senha
    const senhaValida = await this.passwordHasher.compare(dto.senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    // 4. Revogar Refresh Tokens antigos do usuário (Segurança / Single Session ou Refresh Rotation)
    await this.refreshTokenRepository.revokeByUserId(usuario.id);

    // 5. Gerar novos Tokens
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      ...(usuario.idPessoa !== null && usuario.idPessoa !== undefined
        ? { idPessoa: usuario.idPessoa }
        : {}),
    };

    const accessToken = this.tokenProvider.generateAccessToken(payload);
    const refreshToken = this.tokenProvider.generateRefreshToken(payload);

    // 6. Persistir novo Refresh Token
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);
    await this.refreshTokenRepository.create(usuario.id, refreshTokenHash, expiraEm);

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        idPessoa: usuario.idPessoa === undefined ? null : usuario.idPessoa,
      },
      accessToken,
      refreshToken,
    };
  }
}