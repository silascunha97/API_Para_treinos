import { ISessaoTreino } from '../../entities/SessaoTreino';
import { IniciarSessaoTreinoDTO, FinalizarSessaoTreinoDTO } from '../../dtos/SessaoTreinoDTOs';
import { IBaseRepository } from '../../shared/repositories/IBaseRepository';

export interface ISessaoTreinoRepository extends IBaseRepository<ISessaoTreino, IniciarSessaoTreinoDTO, FinalizarSessaoTreinoDTO> {
  findByPessoaId(idPessoa: number): Promise<ISessaoTreino[]>;
  buscarSessaoAtiva(idPessoa: number): Promise<ISessaoTreino | null>;
}