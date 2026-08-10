import { JwtAdapter } from './JwtAdapter';
import { TokenPayload } from '../../domain/providers/ITokenProvider';

describe('JwtAdapter (Infra Implementation)', () => {
  const accessSecret = 'segredo_acesso_para_testes';
  const refreshSecret = 'segredo_refresh_para_testes';
  let tokenProvider: JwtAdapter;

  beforeEach(() => {
    // Usamos '1s' para expirar rapidamente e testar a verificação de tokens expirados
    tokenProvider = new JwtAdapter(accessSecret, refreshSecret, '1s', '1s');
  });

  it('deve gerar um accessToken JWT assinado e conseguir decodificar o payload', () => {
    const payload: TokenPayload = { sub: 1, email: 'augusto@teste.com' };
    
    const token = tokenProvider.generateAccessToken(payload);
    expect(typeof token).toBe('string');

    const decoded = tokenProvider.verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe(payload.sub);
    expect(decoded?.email).toBe(payload.email);
  });

  it('deve retornar null para um accessToken inválido ou expirado', async () => {
    const payload: TokenPayload = { sub: 2, email: 'expirado@teste.com' };
    const token = tokenProvider.generateAccessToken(payload);

    // Espera o token expirar
    await new Promise(resolve => setTimeout(resolve, 1100));

    const decoded = tokenProvider.verifyAccessToken(token);
    expect(decoded).toBeNull();
  });

  it('deve gerar um refreshToken JWT assinado e conseguir decodificar o payload', () => {
    const payload: TokenPayload = { sub: 3, email: 'refresh@teste.com' };
    
    const token = tokenProvider.generateRefreshToken(payload);
    expect(typeof token).toBe('string');

    const decoded = tokenProvider.verifyRefreshToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe(payload.sub);
    expect(decoded?.email).toBe(payload.email);
  });

  it('deve retornar null para um refreshToken inválido ou expirado', async () => {
    const payload: TokenPayload = { sub: 4, email: 'refresh_expirado@teste.com' };
    const token = tokenProvider.generateRefreshToken(payload);

    await new Promise(resolve => setTimeout(resolve, 1100));

    const decoded = tokenProvider.verifyRefreshToken(token);
    expect(decoded).toBeNull();
  });
});