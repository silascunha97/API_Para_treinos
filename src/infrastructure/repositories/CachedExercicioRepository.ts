import { IExercicioRepository } from '../../domain/repositories/IExercicioRepository';
import { ICacheProvider } from '../../domain/providers/ICacheProvider';
import { IExercicio } from '../../domain/entities/Exercicio';
import { CreateExercicioDTO, UpdateExercicioDTO } from '../../domain/dtos/ExercicioDTOs';

export class CachedExercicioRepository implements IExercicioRepository {
  private readonly CACHE_KEY_ALL = 'exercicios:all';
  private readonly TTL_24H = 86400; // 24 horas

  constructor(
    private readonly decoratee: IExercicioRepository, // Repositório Prisma concreto
    private readonly cache: ICacheProvider
  ) {}

  async findAll(): Promise<IExercicio[]> {
    // 1. Tenta buscar no Redis
    const cached = await this.cache.get<IExercicio[]>(this.CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    // 2. Se não existir (Cache Miss), busca no PostgreSQL via Prisma
    const exercicios: IExercicio[] = await this.decoratee.findAll();

    // 3. Salva no Redis para as próximas chamadas
    await this.cache.set(this.CACHE_KEY_ALL, exercicios, this.TTL_24H);

    return exercicios;
  }
  
  async findById(idExercicio: number): Promise<IExercicio | null> {
    const cacheKey = `exercicio:${idExercicio}`;
    const cached = await this.cache.get<IExercicio>(cacheKey);
    if (cached) return cached;

    const exercicio: IExercicio | null = await this.decoratee.findById(idExercicio);
    if (exercicio) { // Only cache if an exercise was found
      await this.cache.set(cacheKey, exercicio, this.TTL_24H);
    }

    return exercicio;
  }

  async create(data: CreateExercicioDTO): Promise<IExercicio> {
    const novoExercicio = await this.decoratee.create(data);

    // INVALIDAÇÃO DE CACHE: Como um novo exercício entrou no catálogo, limpa o cache geral
    await this.cache.del(this.CACHE_KEY_ALL);

    return novoExercicio;
  }

  async update(data: UpdateExercicioDTO): Promise<IExercicio> {
    const exercicioAtualizado = await this.decoratee.update(data);
    await this.cache.del(this.CACHE_KEY_ALL); // Invalida o cache de todos os exercícios
    await this.cache.del(`exercicio:${exercicioAtualizado.idExercicio}`); // Invalida o cache do exercício específico
    return exercicioAtualizado;
  }
  async delete(idExercicio: number): Promise<boolean> {
    const resultado = await this.decoratee.delete(idExercicio);
    if (resultado) {
      await this.cache.del(this.CACHE_KEY_ALL); // Invalida o cache de todos os exercícios
      await this.cache.del(`exercicio:${idExercicio}`); // Invalida o cache do exercício específico
    }
    return resultado;
  }
}