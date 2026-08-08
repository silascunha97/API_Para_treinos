import { PrismaUsuarioRepository } from '../../infrastructure/repositories/PrismaUsuarioRepository';
import { PrismaRefreshTokenRepository } from '../../infrastructure/repositories/PrismaRefreshTokenRepository';
import { BcryptAdapter } from '../../infrastructure/providers/BcryptAdapter';
import { JwtAdapter } from '../../infrastructure/providers/JwtAdapter';
import { CriarContaUseCase } from '../../application/use-cases/auth/CriarContaUseCase';
import { AutenticarComSenhaUseCase } from '../../application/use-cases/auth/AutenticarComSenhaUseCase';

// Instâncias reutilizáveis de infraestrutura
const usuarioRepository = new PrismaUsuarioRepository();
const refreshTokenRepository = new PrismaRefreshTokenRepository();
const passwordHasher = new BcryptAdapter(10);

const jwtAdapter = new JwtAdapter(
  process.env.JWT_ACCESS_SECRET || 'access_secret_key_default',
  process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_default',
  '15m',
  '7d'
);

export function makeCriarContaUseCase(): CriarContaUseCase {
  return new CriarContaUseCase(
    usuarioRepository,
    refreshTokenRepository,
    passwordHasher,
    jwtAdapter
  );
}

export function makeAutenticarComSenhaUseCase(): AutenticarComSenhaUseCase {
  return new AutenticarComSenhaUseCase(
    usuarioRepository,
    refreshTokenRepository,
    passwordHasher,
    jwtAdapter
  );
}