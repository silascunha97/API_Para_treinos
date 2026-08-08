import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../context';

export function requireAuth(context: GraphQLContext) {
  if (!context.usuario) {
    throw new GraphQLError('Acesso não autorizado. Token ausente ou inválido.', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }
  return context.usuario;
}