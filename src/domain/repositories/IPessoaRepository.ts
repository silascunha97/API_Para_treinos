import { IPessoa } from '../entities/Pessoa';
import { CreatePessoaDTO, UpdatePessoaDTO } from '../dtos/PessoaDTOs';

export interface IPessoaRepository {
  findById(id: number): Promise<IPessoa | null>;
  create(data: CreatePessoaDTO): Promise<IPessoa>;
  update(data: UpdatePessoaDTO): Promise<IPessoa>;
  delete(id: number): Promise<boolean>;
}