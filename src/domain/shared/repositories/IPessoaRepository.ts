import { IPessoa } from '../../entities/Pessoa';
import { CreatePessoaDTO, UpdatePessoaDTO } from '../../dtos/PessoaDTOs';
import { IBaseRepository } from '../repositories/IBaseRepository';

export interface IPessoaRepository extends IBaseRepository<IPessoa, CreatePessoaDTO, UpdatePessoaDTO> {
  // Métodos específicos da entidade Pessoa se necessário (ex: calcular TMB)
  atualizarMetabolismo(id: number, tmb: number): Promise<IPessoa>;
}