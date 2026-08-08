import { ProvedorAutenticacao } from '@src/generated/prisma/client';
import { AuthResponseDTO } from '../../../domain/dtos/AuthDTOs';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { IContaRepository } from '../../../domain/repositories/IContaRepository';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { IGoogleAuthProvider } from '../../../domain/providers/IGoogleAuthProvider';
import { ITokenProvider } from '../../../domain/providers/ITokenProvider';
import { IPasswordHasher } from '../../../domain/providers/IPasswordHasher';

export class AutenticarComGoogleUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private contaRepository: IContaRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private googleAuthProvider: IGoogleAuthProvider,
    private tokenProvider: ITokenProvider,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(idToken: string): Promise<AuthResponseDTO> {
    // 1. Validar o token diretamente com o Google
    const googleUser = await this.googleAuthProvider.verifyIdToken(idToken);

    if (!googleUser.emailVerificado) {
      throw new Error('A conta do Google informada precisa estar com e-mail verificado.');
    }

    let usuarioId: number;
    let idPessoa: number | null = null;
    let nomeUsuario = googleUser.nome;

    // 2. Verificar se o vinculo da conta OAuth2 já existe
    const contaExistente = await this.contaRepository.findByProviderAccount(
      ProvedorAutenticacao.GOOGLE,
      googleUser.googleAccountId
    );

    if (contaExistente) {
      // Conta vinculada encontrada! Busca o usuário cadastrado
      const usuario = await this.usuarioRepository.findById(contaExistente.idUsuario);
      if (!usuario) {
        throw new Error('Usuário associado à conta não foi encontrado.');
      }
      usuarioId = usuario.id;
      idPessoa = usuario.idPessoa ?? null;
      nomeUsuario = usuario.nome;
    } else {
      // 3. Caso a conta Google ainda não esteja vinculada, realiza o "Account Linking"
      let usuario = await this.usuarioRepository.findByEmail(googleUser.email);

      if (!usuario) {
        // Se o e-mail não existir no sistema, cria um novo Usuário (sem senha)
        usuario = await this.usuarioRepository.create({
          nome: googleUser.nome,
          email: googleUser.email,
          senha: '', // Senha vazia para satisfazer o tipo CriarContaDTO, pois o login é estritamente via Google
          senhaHash: '', // Senha nula/vazia pois o login é estritamente via Google
        });
      }

      usuarioId = usuario.id;
      idPessoa = usuario.idPessoa ?? null;
      nomeUsuario = usuario.nome;

      // 4. Cria o registro de vínculo da Conta Google
      await this.contaRepository.create({
        idUsuario: usuarioId,
        provedor: ProvedorAutenticacao.GOOGLE,
        provedorAccountId: googleUser.googleAccountId,
      });
    }

    // 5. Revoga sessões antigas
    await this.refreshTokenRepository.revokeByUserId(usuarioId);

    // 6. Emite o par de JWTs no padrão da nossa aplicação
    const payload = {
      sub: usuarioId,
      email: googleUser.email,
      ...(idPessoa !== null
        ? { idPessoa: idPessoa }
        : {}),
    };

    const accessToken = this.tokenProvider.generateAccessToken(payload);
    const refreshToken = this.tokenProvider.generateRefreshToken(payload);

    // 7. Persiste o Refresh Token no banco
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);
    await this.refreshTokenRepository.create(usuarioId, refreshTokenHash, expiraEm);

    return {
      usuario: {
        id: usuarioId,
        nome: nomeUsuario,
        email: googleUser.email,
        idPessoa,
      },
      accessToken,
      refreshToken,
    };
  }
}