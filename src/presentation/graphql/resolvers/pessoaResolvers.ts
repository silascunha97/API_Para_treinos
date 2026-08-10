import { makeCriarPessoaUseCase, makeObterPessoaPorIdUseCase } from '../../../main/factories/pessoaFactory';
import { CreatePessoaDTO } from '../../../domain/dtos/PessoaDTOs';

export const pessoaResolvers = {
 Query: {
    obterPessoaPorId: async (_: unknown, args: { id: string | number }) => {
      const obterPessoaPorIdUseCase = makeObterPessoaPorIdUseCase();
      return await obterPessoaPorIdUseCase.execute(Number(args.id));
    },
    listarPessoas: async () => ({
      dados: [],
      meta: {
        totalRegistros: 0,
        paginaAtual: 1,
        limitePorPagina: 10,
        totalPaginas: 0,
        temProximaPagina: false,
        temPaginaAnterior: false,
      },
    }),
  },
  Mutation: {
    criarPessoa: async (_: unknown, args: { input: CreatePessoaDTO }) => {
      const criarPessoaUseCase = makeCriarPessoaUseCase();
      return await criarPessoaUseCase.execute(args.input);
    },
  },
};