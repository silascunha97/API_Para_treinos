import { IPessoa } from '../entities/Pessoa';
import { CreatePessoaDTO, UpdatePessoaDTO } from '../../application/dtos/PessoaDTOs';
import { IBaseRepository } from './IBaseRepository';

export interface IPessoaRepository extends IBaseRepository<IPessoa, CreatePessoaDTO, UpdatePessoaDTO> {
  findById(id: number): Promise<IPessoa | null>;
  create(data: CreatePessoaDTO): Promise<IPessoa>;
  update(data: UpdatePessoaDTO): Promise<IPessoa>;
  delete(id: number): Promise<boolean>;

  atualizarTaxaMetabolicaBasal(id: number, taxaMetabolicaBasal: number): Promise<IPessoa | null>;
}