export interface RegistrarSerieDTO {
  idSessao: number;
  idExercicio: number;
  numeroSerie: number;
  repsRealizadas?: number;
  tempoIsometriaSeg?: number;
  tempoPausaIsometricaSeg?: number;
  cargaAdicional?: number;
}

export interface SerieResponseDTO {
  idSerie: number;
  idSessao: number;
  idExercicio: number;
  numeroSerie: number;
  repsRealizadas?: number | null;
  tempoIsometriaSeg?: number | null;
  tempoPausaIsometricaSeg?: number | null;
  cargaAdicional?: number | null;
  concluido: boolean;
  
  // Campo computado no DTO
  tipoExecucaoSinalizada: 'DINAMICA' | 'ISOMETRICA' | 'DINAMICA_COM_PAUSA_ISOMETRICA';
}