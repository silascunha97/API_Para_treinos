import { IPessoaRepository } from '../../../domain/repositories/IPessoaRepository';
import { CreatePessoaDTO } from '../../../domain/dtos/PessoaDTOs';
import { IPessoa } from '../../../domain/entities/Pessoa';

export class CriarPessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(dto: CreatePessoaDTO): Promise<IPessoa> {
    // Validações de negócio (se houver) podem vir aqui
    return await this.pessoaRepository.create(dto);
  }
}