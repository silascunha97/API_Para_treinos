export interface CreatePessoaDTO {
  peso?: number;
  altura?: number;
  taxaMetabolicaBasal?: number;
}

export interface UpdatePessoaDTO {
  id: number;
  peso?: number;
  altura?: number;
  taxaMetabolicaBasal?: number;
}