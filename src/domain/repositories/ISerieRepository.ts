import { ISerie } from '../entities/Serie';
import { RegistrarSerieDTO, AtualizarSerieDTO } from '../../domain/dtos/SerieDTOs';

export interface ISerieRepository {
  findById(idSerie: number): Promise<ISerie | null>;
  findBySessaoId(idSessao: number): Promise<ISerie[]>;
  create(data: RegistrarSerieDTO): Promise<ISerie>;
  update(data: AtualizarSerieDTO): Promise<ISerie>;
  delete(idSerie: number): Promise<boolean>;
}