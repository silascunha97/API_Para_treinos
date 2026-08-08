import { makeCriarContaUseCase, makeAutenticarComSenhaUseCase, makeAutenticarComGoogleUseCase } from '../../../main/factories/authFactory';
import { CriarContaDTO, AutenticarDTO } from '../../../domain/dtos/AuthDTOs';

export const authResolvers = {
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