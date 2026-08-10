import { SeriesEntity as ISerie, SeriesEntity } from '../entities/Serie';
import { RegistrarSerieDTO, SerieResponseDTO as AtualizarSerieDTO } from '../../domain/dtos/SerieDTOs';


export type CreateSerieData = Omit<SeriesEntity, 'idSerie'>;

export interface ISerieRepository {
  findById(idSerie: number): Promise<ISerie | null>;
  findBySessaoId(idSessao: number): Promise<ISerie[]>;
  create(data: CreateSerieData): Promise<ISerie>;
  update(data: AtualizarSerieDTO): Promise<ISerie>;
  delete(idSerie: number): Promise<boolean>;
}