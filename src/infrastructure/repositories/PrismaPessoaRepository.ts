import { IContaRepository } from '@src/domain/repositories/IContaRepository';
import { CreatePessoaDTO, UpdatePessoaDTO } from '../../domain/dtos/PessoaDTOs';
import { IPessoa } from '../../domain/entities/Pessoa';
import { IPessoaRepository } from '../../domain/repositories/IPessoaRepository';
import { Pessoa as PrismaPessoa } from '../../generated/prisma/client';
import { prisma } from '../database/prisma/prismaClient';

export class PrismaPessoaRepository implements IPessoaRepository {

  async findById(id: number): Promise<IPessoa | null> {
    const pessoa = await prisma.pessoa.findUnique({ where: { id } });

    return pessoa ? this.paraEntidade(pessoa) : null;
  }

  async create(data: CreatePessoaDTO): Promise<IPessoa> {
    const pessoa = await prisma.pessoa.create({ data });

    return this.paraEntidade(pessoa);
  }

  async update(data: UpdatePessoaDTO): Promise<IPessoa> {
    const { id, ...dados } = data;
    const pessoa = await prisma.pessoa.update({
      where: { id },
      data: dados,
    });

    return this.paraEntidade(pessoa);
  }

  async delete(id: number): Promise<boolean> {
    const resultado = await prisma.pessoa.deleteMany({ where: { id } });

    return resultado.count > 0;
  }

  private paraEntidade(pessoa: PrismaPessoa): IPessoa {
    return {
      id: pessoa.id,
      peso: pessoa.peso?.toNumber() ?? null,
      altura: pessoa.altura?.toNumber() ?? null,
      taxaMetabolicaBasal: pessoa.taxaMetabolicaBasal?.toNumber() ?? null,
    };
  }
}
