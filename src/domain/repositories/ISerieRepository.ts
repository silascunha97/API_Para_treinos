import { ISerie } from '../../domain/entities/Series';
import { RegistrarSerieDTO, AtualizarSerieDTO } from '../../application/dtos/SerieDTOs';  
import { IBaseRepository } from './IBaseRepository';

export interface ISerieRepository extends IBaseRepository<ISerie, RegistrarSerieDTO, AtualizarSerieDTO> {
  findById(idSerie: number): Promise<ISerie | null>;
  findBySessaoId(idSessao: number): Promise<ISerie[]>;
  create(data: RegistrarSerieDTO): Promise<ISerie>;
  update(data: AtualizarSerieDTO): Promise<ISerie>;
  delete(idSerie: number): Promise<boolean>;

  findBySessaoId(idSessao: number): Promise<ISerie[]>;
  obterVolumeTotalSessao(idSessao: number): Promise<number>;
}