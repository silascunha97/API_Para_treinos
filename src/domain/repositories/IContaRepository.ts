import { ProvedorAutenticacao } from "@src/generated/prisma/client";


export interface ContaEntity {
  id: number;
  idUsuario: number;
  provedor: ProvedorAutenticacao;
  provedorAccountId: string;
}

export interface IContaRepository {
  findByProviderAccount(provedor: ProvedorAutenticacao, provedorAccountId: string): Promise<ContaEntity | null>;
  create(data: { idUsuario: number; provedor: ProvedorAutenticacao; provedorAccountId: string }): Promise<ContaEntity>;
}