import { ISessaoTreino } from '../entities/SessaoTreino';
import { IniciarSessaoTreinoDTO, FinalizarSessaoTreinoDTO } from '../../application/dtos/SessaoTreinoDTOs';
import { IBaseRepository } from '../../domain/repositories/IBaseRepository';


export interface ISessaoTreinoRepository extends IBaseRepository<ISessaoTreino, IniciarSessaoTreinoDTO, FinalizarSessaoTreinoDTO>{
  findById(idSessao: number): Promise<ISessaoTreino | null>;
  findByPessoaId(idPessoa: number): Promise<ISessaoTreino[]>;
  create(data: IniciarSessaoTreinoDTO): Promise<ISessaoTreino>;
  finalizar(data: FinalizarSessaoTreinoDTO): Promise<ISessaoTreino>;
  delete(idSessao: number): Promise<boolean>;

  findByPessoaId(idPessoa: number): Promise<ISessaoTreino[]>;
  buscarSessoesAtivas(idPessoa: number): Promise<ISessaoTreino | null>;
}