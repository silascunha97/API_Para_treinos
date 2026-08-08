import { ICacheProvider } from '../../domain/providers/ICacheProvider';
import { ISessaoTreinoRepository } from '@src/domain/shared/repositories/ISessaoTreinoRepository';
import { ISessaoTreino } from '../../domain/entities/SessaoTreino';
import { IniciarSessaoTreinoDTO, FinalizarSessaoTreinoDTO } from '../../domain/dtos/SessaoTreinoDTOs';
import { IPaginatedResult, IPaginationParams } from '../../domain/shared/types/Pagination';
import { IQueryOptions } from '../../domain/shared/types/QueryOptions';

export class CachedSessaoTreinoRepository implements ISessaoTreinoRepository {
  private readonly TTL_15M = 900; // 15 minutos
  private readonly TTL_1H = 3600; // 1 hora para listas e itens individuais

  // Cache keys
  private readonly CACHE_KEY_ALL_SESSIONS = 'sessoes:all';
  private readonly CACHE_KEY_PAGINATED_PREFIX = 'sessoes:paginated:';
  private readonly CACHE_KEY_SESSION_BY_ID_PREFIX = 'sessoes:id:';
  private readonly CACHE_KEY_SESSIONS_BY_PERSON_LIST_PREFIX = 'sessoes:pessoa:list:'; // For findByPessoaId

  constructor(
    private readonly decoratee: ISessaoTreinoRepository,
    private readonly cache: ICacheProvider
  ) {}
    findByPessoaId(idPessoa: number): Promise<ISessaoTreino[]> {
        throw new Error('Method not implemented.');
    }
    findById(id: number): Promise<ISessaoTreino | null> {
        throw new Error('Method not implemented.');
    }
    findAll(options?: IQueryOptions<ISessaoTreino> | undefined): Promise<ISessaoTreino[]> {
        throw new Error('Method not implemented.');
    }
    findPaginated(params: IPaginationParams, options?: IQueryOptions<ISessaoTreino> | undefined): Promise<IPaginatedResult<ISessaoTreino>> {
        throw new Error('Method not implemented.');
    }
    delete(id: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

  private getUserCachePrefix(idPessoa: number): string {
    return `treinos:pessoa:${idPessoa}:`;
  }

  // Renamed from findSessaoAtiva to match ISessaoTreinoRepository
  async buscarSessaoAtiva(idPessoa: number): Promise<ISessaoTreino | null> {
    const cacheKey = `${this.getUserCachePrefix(idPessoa)}ativa`;
    const cached = await this.cache.get<ISessaoTreino>(cacheKey);
    if (cached) return cached;

    const sessao = await this.decoratee.buscarSessaoAtiva(idPessoa);
    if (sessao) {
      await this.cache.set(cacheKey, sessao, this.TTL_15M);
    }
    return sessao;
  }

  async create(data: IniciarSessaoTreinoDTO): Promise<ISessaoTreino> {
    const novaSessao = await this.decoratee.create(data);

    // INVALIDAÇÃO: Invalida o cache de treinos desta pessoa
    await this.cache.delByPrefix(this.getUserCachePrefix(data.idPessoa));

    return novaSessao;
  }

  async update(data: FinalizarSessaoTreinoDTO): Promise<ISessaoTreino> {
    const sessaoFinalizada = await this.decoratee.update(data);

    // INVALIDAÇÃO: Limpa cache do usuário ao encerrar o treino
    await this.cache.delByPrefix(this.getUserCachePrefix(sessaoFinalizada.idPessoa));

    return sessaoFinalizada;
  }
}