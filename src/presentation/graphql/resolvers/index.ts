import { pessoaResolvers } from './pessoaResolvers';

export const resolvers = {
  Query: {
    ...('Query' in pessoaResolvers ? pessoaResolvers.Query : {}),
    obterExercicioPorId: async () => null,
    listarExercicios: async () => [],
    obterSessaoAtiva: async () => null,
    listarSeriesPorSessao: async () => [],
  },
  Mutation: {
    ...('Mutation' in pessoaResolvers ? pessoaResolvers.Mutation : {}),
    criarExercicio: async () => null,
    iniciarSessao: async () => null,
    finalizarSessao: async () => null,
    registrarSerie: async () => null,
  },
};