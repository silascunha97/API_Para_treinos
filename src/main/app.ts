import { createGraphQLServer } from '../presentation/graphql/server';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const { httpServer } = await createGraphQLServer();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL rodando em http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});