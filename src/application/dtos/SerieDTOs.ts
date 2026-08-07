export interface RegistrarSerieDTO {
  idSessao: number;
  idExercicio: number;
  numeroSerie: number;
  repsRealizadas?: number;
  cargaAdicional?: number;
  concluido?: boolean;
}

export interface AtualizarSerieDTO {
  idSerie: number;
  repsRealizadas?: number;
  cargaAdicional?: number;
  concluido?: boolean;
}