import { IRefreshTokenRepository, RefreshTokenEntity } from '../../domain/repositories/IRefreshTokenRepository';
import { prisma } from '../database/prisma/prismaClient'; // Importe a sua instância Singleton do Prisma aqui.

// Importe a sua instância Singleton do Prisma aqui.

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  
  async create(idUsuario: number, tokenHash: string, expiraEm: Date): Promise<RefreshTokenEntity> {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        idUsuario,
        tokenHash,
        expiraEm,
        revogado: false, // Por padrão, nasce ativo
      },
    });

    return refreshToken;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    
    return refreshToken;
  }

  async revokeByUserId(idUsuario: number): Promise<void> {
    // Invalida todos os tokens ativos vinculados a este usuário.
    // Isso é útil para fluxos de "Sair de todos os dispositivos" ou ao logar novamente.
    await prisma.refreshToken.updateMany({
      where: {
        idUsuario,
        revogado: false, 
      },
      data: {
        revogado: true,
      },
    });
  }
}