import { PrismaExercicioRepository } from '../../infrastructure/repositories/PrismaExercicioRepository';
import { CachedExercicioRepository } from '../../infrastructure/repositories/CachedExercicioRepository';
import { RedisAdapter } from '../../infrastructure/providers/RedisAdapter';
import { ListarExerciciosUseCase } from '../../application/use-cases/exercicio/ListarExerciciosUseCase';
import { CriarExercicioUseCase } from '../../application/use-cases/exercicio/CriarExercicioUseCase';

// Repositórios e Cache
const redisAdapter = new RedisAdapter();
const prismaExercicioRepository = new PrismaExercicioRepository();
const cachedExercicioRepository = new CachedExercicioRepository(
  prismaExercicioRepository,
  redisAdapter
);

// Exports das Factories dos Casos de Uso
export function makeListarExerciciosUseCase(): ListarExerciciosUseCase {
  return new ListarExerciciosUseCase(cachedExercicioRepository);
}

export function makeCriarExercicioUseCase(): CriarExercicioUseCase {
  return new CriarExercicioUseCase(cachedExercicioRepository);
}