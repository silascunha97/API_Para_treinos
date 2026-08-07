import { GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server/errors';

export const formatGraphQLError = (
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError => { // The unwrapResolverError function already extracts the original error
  const originalError = unwrapResolverError(error);

  // Log interno do erro no ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 [GraphQL Error]:', originalError || formattedError);
  }

  // Oculta detalhes sensíveis de erros internos/unhandled em produção
  if (process.env.NODE_ENV === 'production') {
    if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      return {
        message: 'Ocorreu um erro interno no servidor.',
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      };
    }
  }

  return formattedError;
};