export interface IPessoaProps {
  id?: number;
  peso?: number | null;
  altura?: number | null;
  taxaMetabolicaBasal?: number | null;
}

export class Pessoa {
  public readonly id: number | undefined;
  public readonly peso: number | null;
  public readonly altura: number | null;
  public readonly taxaMetabolicaBasal: number | null;

  constructor(props: IPessoaProps) {
    // 1. Validação de regras de negócio (Guard Clause)
    const pesoInvalido = props.peso !== undefined && props.peso !== null && props.peso <= 0;
    const alturaInvalida = props.altura !== undefined && props.altura !== null && props.altura <= 0;

    if (pesoInvalido || alturaInvalida) {
      throw new Error('Peso e altura devem ser valores positivos.');
    }

    // 2. Atribuição de propriedades
    this.id = props.id;
    this.peso = props.peso ?? null;
    this.altura = props.altura ?? null;
    this.taxaMetabolicaBasal = props.taxaMetabolicaBasal ?? null;
  }
}