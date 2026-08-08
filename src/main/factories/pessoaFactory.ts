import { PrismaPessoaRepository } from '../../infrastructure/repositories/PrismaPessoaRepository';
import { CriarPessoaUseCase } from '../../application/use-cases/pessoa/CriarPessoaUseCase';

export function makeCriarPessoaUseCase(): CriarPessoaUseCase {
  const pessoaRepository = new PrismaPessoaRepository();
  return new CriarPessoaUseCase(pessoaRepository);
}