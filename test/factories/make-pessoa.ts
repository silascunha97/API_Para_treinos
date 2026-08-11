import { IPessoa as PessoaEntity } from '../../src/domain/entities/Pessoa';

export function makePessoa(override: Partial<PessoaEntity> = {}, id?: number): PessoaEntity {
  return {
    id: id ?? 1,
    peso: 75.5,
    altura: 1.78,
    taxaMetabolicaBasal: 1750.0,
    ...override,
  };
}