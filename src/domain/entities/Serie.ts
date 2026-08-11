export interface SeriesEntity {
  idSerie?: number;
  idSessao: number;
  idExercicio: number;
  numeroSerie: number;
  repsRealizadas?: number | null;
  tempoIsometriaSeg?: number | null;
  tempoPausaIsometricaSeg?: number | null;
  cargaAdicional?: number | null;
  concluido?: boolean;
}

// Value Object / Helper de validação do domínio
export class SeriesExecutionHelper {
  static isIsometricaPura(serie: SeriesEntity): boolean {
    return Boolean(serie.tempoIsometriaSeg && serie.tempoIsometriaSeg > 0 && !serie.repsRealizadas);
  }

  static isDinamicaComPausa(serie: SeriesEntity): boolean {
    return Boolean(
      serie.repsRealizadas && 
      serie.repsRealizadas > 0 && 
      serie.tempoPausaIsometricaSeg && 
      serie.tempoPausaIsometricaSeg > 0
    );
  }
}