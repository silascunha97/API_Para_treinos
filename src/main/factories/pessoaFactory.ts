import { PrismaPessoaRepository } from '../../infrastructure/repositories/PrismaPessoaRepository';
import { CriarPessoaUseCase } from '../../application/use-cases/pessoa/CriarPessoaUseCase';
import { ObterPessoaPorIdUseCase } from '../../application/use-cases/pessoa/ObterPessoaPorIdUseCase';

const pessoaRepository = new PrismaPessoaRepository();

export function makeCriarPessoaUseCase(): CriarPessoaUseCase {
  return new CriarPessoaUseCase(pessoaRepository);
}

export function makeObterPessoaPorIdUseCase(): ObterPessoaPorIdUseCase {
  return new ObterPessoaPorIdUseCase(pessoaRepository);
}