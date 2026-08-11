import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { GraphQLContext, buildGraphQLContext } from './context';
import { formatGraphQLError } from '../errors/formatError';
import { resolvers } from './resolvers'; // Import actual resolvers
import { typeDefs } from './typeDefs';
import { startTreinoWorkers } from '../../infrastructure/workers/treinoMetricsWorker';


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
      // Decodifica o Bearer JWT do header Authorization e popula context.usuario
      // (mesma lógica usada pelo guard requireAuth em ./guards/graph.guards.ts).
      context: buildGraphQLContext,
    }),
  );

  return { app, httpServer };

  async function bootstrap() {
  // Iniciar consumidor de mensagens do RabbitMQ
  await startTreinoWorkers();

  // Iniciar servidor Apollo / Express
  console.log('🚀 API de Treinos pronta e operando com RabbitMQ.');
}

}
