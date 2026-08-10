import { makeCriarContaUseCase, makeAutenticarComSenhaUseCase, makeAutenticarComGoogleUseCase, makeObterUsuarioLogadoUseCase } from '../../../main/factories/authFactory';
import { CriarContaDTO, AutenticarDTO } from '../../../domain/dtos/AuthDTOs';
import { GraphQLContext } from '../context';
import { requireAuth } from '../guards/graph.guards';
import { GraphQLError } from 'graphql';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const payload = requireAuth(context);
      const obterUsuarioLogadoUseCase = makeObterUsuarioLogadoUseCase();
      const usuario = await obterUsuarioLogadoUseCase.execute(payload.sub);

      if (!usuario) {
        throw new GraphQLError('Usuário autenticado não encontrado.', {
          extensions: { code: 'NOT_FOUND', http: { status: 404 } },
        });
      }

      return usuario;
    },
  },
  Mutation: {
    registrar: async (_: unknown, args: { input: CriarContaDTO }) => {
      const criarContaUseCase = makeCriarContaUseCase();
      return await criarContaUseCase.execute(args.input);
    },

    login: async (_: unknown, args: { input: AutenticarDTO }) => {
      const autenticarComSenhaUseCase = makeAutenticarComSenhaUseCase();
      return await autenticarComSenhaUseCase.execute(args.input);
    },
    autenticarComGoogle: async (_: unknown, args: { input: { idToken: string } }) => {
      const useCase = makeAutenticarComGoogleUseCase();
      return await useCase.execute(args.input.idToken);
    },
  },
};