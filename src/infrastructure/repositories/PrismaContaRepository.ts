import { prisma } from '../database/prisma/prismaClient';
import { IContaRepository, ContaEntity } from '../../domain/repositories/IContaRepository';
import { ProvedorAutenticacao } from '../../generated/prisma/client';

export class PrismaContaRepository implements IContaRepository {
  async findByProviderAccount(provedor: ProvedorAutenticacao, provedorAccountId: string): Promise<ContaEntity | null> {
    return await prisma.conta.findUnique({
      where: {
        provedor_provedorAccountId: {
          provedor,
          provedorAccountId,
        },
      },
    });
  }

  async create(data: { idUsuario: number; provedor: ProvedorAutenticacao; provedorAccountId: string }): Promise<ContaEntity> {
    return await prisma.conta.create({
      data: {
        idUsuario: data.idUsuario,
        provedor: data.provedor,
        provedorAccountId: data.provedorAccountId,
      },
    });
  }
}