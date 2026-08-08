export interface ISessaoTreino {
  idSessao: number;
  idPessoa: number;
  dataHoraInicio: Date;
  dataHoraFim?: Date | null;
  observacoes?: string | null;
}