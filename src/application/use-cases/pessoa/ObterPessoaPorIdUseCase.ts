import { IPessoaRepository } from '../../../domain/repositories/IPessoaRepository';
import { IPessoa } from '../../../domain/entities/Pessoa';

export class ObterPessoaPorIdUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(id: number): Promise<IPessoa | null> {
    return await this.pessoaRepository.findById(id);
  }
}
