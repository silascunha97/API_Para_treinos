export interface ISessaoTreinoProps {
  idSessao?: number;
  idPessoa: number;
  dataHoraInicio: Date;
  dataHoraFim?: Date | null;
  observacoes?: string | null;
}

export class SessaoTreino {
  public readonly idSessao: number | undefined;
  public readonly idPessoa: number;
  public readonly dataHoraInicio: Date;
  public dataHoraFim: Date | null;
  public observacoes: string | null;

  constructor(props: ISessaoTreinoProps) {
    this.idSessao = props.idSessao;
    this.idPessoa = props.idPessoa;
    this.dataHoraInicio = props.dataHoraInicio;
    this.dataHoraFim = props.dataHoraFim ?? null;
    this.observacoes = props.observacoes ?? null;
  }

  public finalizar(dataFim: Date = new Date()): void {
    if (dataFim < this.dataHoraInicio) {
      throw new Error('A data de término não pode ser anterior ao início do treino.');
    }
    this.dataHoraFim = dataFim;
  }
}