import { CriarContaUseCase } from './CriarContaUseCase';
import { IRefreshTokenRepository, RefreshTokenEntity } from '../../../domain/repositories/IRefreshTokenRepository';
import { IUsuarioRepository, UsuarioEntity } from '../../../domain/repositories/IUsuarioRepository';
import { IPasswordHasher } from '../../../domain/providers/IPasswordHasher';

import { ITokenProvider, TokenPayload } from '../../../domain/providers/ITokenProvider'; // Keep this line
import { FakePasswordHasher } from '../../../test/fakes/FakePasswordHasher'; // Adjusted import path to be relative to src/
import { Usuario } from '../../../domain/entities/UsuarioEntity';

// Define a minimal RefreshTokenEntity interface for the fake repository
// This is inferred from the IRefreshTokenRepository contract and the error message.


// Dublês de teste simples (In-Memory / Fake)
// Dublês de teste simples (In-Memory / Fake)
class InMemoryUsuarioRepository implements IUsuarioRepository {
  public usuarios: Usuario[] = [];

  // 1. Usa Parameters<...> para herdar automaticamente o tipo de entrada exato da interface
  async create(data: Parameters<IUsuarioRepository['create']>[0]) {
    const id = this.usuarios.length + 1;

    const usuario = new Usuario({
      id,
      ...data,
    });

    this.usuarios.push(usuario);

    // 2. O cast garante ao TypeScript que o objeto retornado possui o ID numérico preenchido
    return usuario as unknown as Awaited<ReturnType<IUsuarioRepository['create']>>;
  }

  async findById(id: number): Promise<UsuarioEntity | null> {
    const found = this.usuarios.find((u) => u.id === id);
    return found ? (found as unknown as UsuarioEntity) : null;
  }

  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const found = this.usuarios.find((u) => u.email === email);
    return found ? (found as unknown as UsuarioEntity) : null;
  }
}

class FakeRefreshTokenRepository implements IRefreshTokenRepository {
  public refreshTokens: RefreshTokenEntity[] = [];
  private nextId = 1;

  async create(idUsuario: number, tokenHash: string, expiraEm: Date): Promise<RefreshTokenEntity> {
    const newRefreshToken: RefreshTokenEntity = {
      id: (this.nextId++).toString(), // Convert number to string
      idUsuario,
      tokenHash,
      revogado: false, // Valor padrão para corresponder à interface
      expiraEm,
    };
    this.refreshTokens.push(newRefreshToken);
    return Promise.resolve(newRefreshToken);
  }

  async revokeByUserId(userId: number): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(token => token.idUsuario !== userId);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const found = this.refreshTokens.find(token => token.tokenHash === tokenHash);
    return Promise.resolve(found ?? null);
  }
}

class FakeTokenProvider implements ITokenProvider {
  generateAccessToken(payload: TokenPayload): string {
    return `access_token_${payload.sub}`;
  }
  generateRefreshToken(payload: TokenPayload): string {
    return `refresh_token_${payload.sub}`;
  }
  verifyAccessToken(token: string): TokenPayload | null { return null; }
  verifyRefreshToken(token: string): TokenPayload | null { return null; }
}

describe('CriarContaUseCase', () => {
  let usuarioRepo: InMemoryUsuarioRepository;
  let refreshTokenRepo: FakeRefreshTokenRepository;
  let passwordHasher: IPasswordHasher;
  let tokenProvider: ITokenProvider;
  let useCase: CriarContaUseCase;

  beforeEach(() => {
    usuarioRepo = new InMemoryUsuarioRepository();
    refreshTokenRepo = new FakeRefreshTokenRepository();
    passwordHasher = new FakePasswordHasher(); // Usando a implementação fake
    tokenProvider = new FakeTokenProvider();
    useCase = new CriarContaUseCase(usuarioRepo, refreshTokenRepo, passwordHasher, tokenProvider);
  });

  it('deve criar uma nova conta de usuário com a senha criptografada', async () => {
    const input = {
      nome: 'Augusto Silva',
      email: 'augusto@teste.com',
      senha: 'SenhaSegura123',
    };

    const resultado = await useCase.execute(input);

    expect(resultado).toHaveProperty('id');
    expect(resultado.usuario.email).toBe('augusto@teste.com'); // Corrigido para acessar via 'usuario'
    expect(resultado.accessToken).toBeDefined();
    expect(resultado.refreshToken).toBeDefined();
    expect(usuarioRepo.usuarios).toHaveLength(1); // Garante que o array não está vazio
    expect(usuarioRepo.usuarios[0]!.senhaHash).toBe('hashed_SenhaSegura123');
  });

  it('não deve permitir criar conta com e-mail já cadastrado', async () => {
    // Cadastra previamente um usuário
    await usuarioRepo.create({
      nome: 'Existente',
      email: 'augusto@teste.com',
      senha: 'dummy_senha', // Adicionado para satisfazer o tipo CriarContaDTO
      senhaHash: 'hashed_123456',
    });

    const input = {
      nome: 'Augusto Silva',
      email: 'augusto@teste.com',
      senha: 'OutraSenha123',
    };

    await expect(useCase.execute(input)).rejects.toThrow('E-mail já cadastrado no sistema.');
  });
});