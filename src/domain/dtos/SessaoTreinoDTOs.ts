export interface IniciarSessaoTreinoDTO {
  idPessoa: number;
  dataHoraInicio?: Date;
  observacoes?: string;
}

export interface FinalizarSessaoTreinoDTO {
  idSessao: number;
  dataHoraFim?: Date;
  observacoes?: string;
}