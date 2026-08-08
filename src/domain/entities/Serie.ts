export interface ISerie {
  idSerie: number;
  idSessao: number;
  idExercicio: number;
  numeroSerie: number;
  repsRealizadas?: number | null;
  cargaAdicional?: number | null;
  concluido?: boolean | null;
}