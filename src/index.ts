import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import { prisma } from './lib/prisma';

// 1. Definição do Schema GraphQL
const typeDefs = `#graphql
  type Query {
    healthCheck: String!
  }
`;

// 2. Resolvers (Lógica das requisições)
const resolvers = {
  Query: {
    healthCheck: () => 'API GraphQL Express com TS rodando perfeitamente!',
  },
};

async function bootstrap() {
  const app = express();
  const PORT = process.env.PORT || 4000;

  // Testa a conexão com o banco de dados antes de subir o servidor
  await prisma.$connect();
  console.log('🐘 Conectado ao PostgreSQL via Prisma');

  // 3. Instância do Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // 4. Integrar Apollo ao Express via Middleware
  app.use(express.json());
  app.use('/graphql', cors<cors.CorsRequest>(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});

// Encerra a conexão com o banco de dados de forma limpa ao finalizar o processo
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});