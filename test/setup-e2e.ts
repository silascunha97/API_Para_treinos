// Carrega as variáveis de ambiente do .env (DATABASE_URL, JWT_*, REDIS_*, RABBITMQ_URI, ...)
// antes de qualquer suíte e2e subir o servidor GraphQL real.
import 'dotenv/config';

// Os testes e2e batem em serviços reais (Postgres/Redis/RabbitMQ), que podem
// ser mais lentos que o timeout padrão do Jest em máquinas de desenvolvimento/CI.
jest.setTimeout(30000);
