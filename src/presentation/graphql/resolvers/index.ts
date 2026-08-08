import { pessoaResolvers } from './pessoaResolvers';
import { authResolvers } from './authResolvers';

export const resolvers = {
  Query: {
    healthCheck: async () => 'API is healthy',
    ...('Query' in pessoaResolvers ? pessoaResolvers.Query : {}),
    obterExercicioPorId: async () => null,
    listarExercicios: async () => [],
    obterSessaoAtiva: async () => null,
    listarSeriesPorSessao: async () => [],
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...('Mutation' in pessoaResolvers ? pessoaResolvers.Mutation : {}),
    criarExercicio: async () => null,
    iniciarSessao: async () => null,
    finalizarSessao: async () => null,
    registrarSerie: async () => null,
  },
};