import { ISerie } from '../../entities/Serie';
import { RegistrarSerieDTO, AtualizarSerieDTO } from '../../dtos/SerieDTOs';
import { IBaseRepository } from '../../shared/repositories/IBaseRepository';

export interface ISerieRepository extends IBaseRepository<ISerie, RegistrarSerieDTO, AtualizarSerieDTO> {
  findBySessaoId(idSessao: number): Promise<ISerie[]>;
  obterVolumeTotalSessao(idSessao: number): Promise<number>;
}