import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { GraphQLContext } from '../../@types/graphql';
import { formatGraphQLError } from '../errors/formatError';
import { resolvers } from './resolvers'; // Import actual resolvers
import { typeDefs } from './typeDefs';

export async function createGraphQLServer(): Promise<{
  app: Application;
  httpServer: http.Server;
}> {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers, // Use actual resolvers
    formatError: formatGraphQLError,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const headerUsuarioId = req.headers['x-usuario-id'];
        const usuarioId =
          typeof headerUsuarioId === 'string'
            ? Number(headerUsuarioId)
            : Number.NaN;

        return {
          req,
          ...(Number.isInteger(usuarioId) && usuarioId > 0 ? { usuarioId } : {}),
        };
      },
    }),
  );

  return { app, httpServer };
}
