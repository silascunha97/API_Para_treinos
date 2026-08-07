import { CreatePessoaDTO, UpdatePessoaDTO } from '../../application/dtos/PessoaDTOs';
import { IPessoa } from '../../domain/entities/Pessoa';
import { IPessoaRepository } from '../../domain/repositories/IPessoaRepository';
import { IPaginatedResult, IPaginationParams } from '../../domain/shared/types/Pagination';
import { IQueryOptions } from '../../domain/shared/types/QueryOptions';
import { Pessoa as PrismaPessoa, Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaPessoaRepository implements IPessoaRepository {
  async findById(id: number): Promise<IPessoa | null> {
    const pessoa = await prisma.pessoa.findUnique({ where: { id } });

    return pessoa ? this.paraEntidade(pessoa) : null;
  }

  async findAll(options?: IQueryOptions<IPessoa>): Promise<IPessoa[]> {
    const argumentos: Prisma.PessoaFindManyArgs = {
      where: this.criarFiltro(options),
    };
    const orderBy = this.criarOrdenacao(options);

    if (orderBy) argumentos.orderBy = orderBy;

    const pessoas = await prisma.pessoa.findMany(argumentos);

    return pessoas.map((pessoa) => this.paraEntidade(pessoa));
  }

  async findPaginated(
    params: IPaginationParams,
    options?: IQueryOptions<IPessoa>,
  ): Promise<IPaginatedResult<IPessoa>> {
    const paginaAtual = Math.max(1, params.pagina);
    const limitePorPagina = Math.max(1, params.limite);
    const where = this.criarFiltro(options);
    const orderBy = this.criarOrdenacao(options, params);

    const [totalRegistros, pessoas] = await prisma.$transaction([
      prisma.pessoa.count({ where }),
      prisma.pessoa.findMany({
        where,
        skip: (paginaAtual - 1) * limitePorPagina,
        take: limitePorPagina,
        ...(orderBy && { orderBy }),
      }),
    ]);

    const totalPaginas = Math.ceil(totalRegistros / limitePorPagina);

    return {
      dados: pessoas.map((pessoa) => this.paraEntidade(pessoa)),
      meta: {
        totalRegistros,
        paginaAtual,
        limitePorPagina,
        totalPaginas,
        temProximaPagina: paginaAtual < totalPaginas,
        temPaginaAnterior: paginaAtual > 1,
      },
    };
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

  async atualizarTaxaMetabolicaBasal(
    id: number,
    taxaMetabolicaBasal: number,
  ): Promise<IPessoa | null> {
    try {
      const pessoa = await prisma.pessoa.update({
        where: { id },
        data: { taxaMetabolicaBasal },
      });

      return this.paraEntidade(pessoa);
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2025'
      ) {
        return null;
      }

      throw erro;
    }
  }

  private criarFiltro(options?: IQueryOptions<IPessoa>): Prisma.PessoaWhereInput {
    const onde = options?.onde;
    if (!onde) return {};

    return Object.fromEntries(
      Object.entries(onde).map(([campo, valor]) => [
        campo,
        Array.isArray(valor) ? { in: valor } : valor,
      ]),
    ) as Prisma.PessoaWhereInput;
  }

  private criarOrdenacao(
    options?: IQueryOptions<IPessoa>,
    params?: IPaginationParams,
  ): Prisma.PessoaOrderByWithRelationInput | undefined {
    const ordenacao = options?.ordenarPor ??
      (params?.ordenarPor
        ? { campo: params.ordenarPor as keyof IPessoa, direcao: params.ordem ?? 'asc' }
        : undefined);

    if (!ordenacao) return undefined;

    const camposPermitidos: (keyof IPessoa)[] = [
      'id',
      'peso',
      'altura',
      'taxaMetabolicaBasal',
    ];

    if (!camposPermitidos.includes(ordenacao.campo)) return undefined;

    return { [ordenacao.campo]: ordenacao.direcao };
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
