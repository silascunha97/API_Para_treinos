import { IPaginatedResult, IPaginationParams } from '../types/Pagination';
import { IQueryOptions } from '../types/QueryOptions';

export interface IBaseRepository<T, CreateDTO, UpdateDTO, ID = number> {
  findById(id: ID): Promise<T | null>;
  findAll(options?: IQueryOptions<T>): Promise<T[]>;
  findPaginated(params: IPaginationParams, options?: IQueryOptions<T>): Promise<IPaginatedResult<T>>;
  create(data: CreateDTO): Promise<T>;
  update(data: UpdateDTO): Promise<T>;
  delete(id: ID): Promise<boolean>;
}