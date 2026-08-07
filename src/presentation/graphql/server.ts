import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './typeDefs';
import { formatGraphQLError } from './errors/formatError';
import { GraphQLContext } from '../../@types/graphql';

// Resolvers temporários (mock) até conectarmos os casos de uso
const dummyResolvers = {
  Query: {
    obterPessoaPorId: () => null,
    listarPessoas: () => ({
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
};

export async function createGraphQLServer(): Promise<{ app: Application; httpServer: http.Server }> {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers: dummyResolvers,
    formatError: formatGraphQLError,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const context: GraphQLContext = {
          req,
        };
        const userIdHeader = req.headers['x-usuario-id'];
        if (typeof userIdHeader === 'string') {
          const parsedId = Number(userIdHeader);
          if (!isNaN(parsedId)) {
            context.usuarioId = parsedId;
          }
        }
        return context;
      },
    })
  );

  return { app, httpServer };
}