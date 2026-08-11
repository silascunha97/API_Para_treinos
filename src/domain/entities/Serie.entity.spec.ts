import { SeriesExecutionHelper, SeriesEntity } from './Serie';

describe('SeriesExecutionHelper (Domain Unit Tests)', () => {
  describe('isIsometricaPura', () => {
    it('deve retornar true quando houver tempo de isometria e nenhuma repetição registrada', () => {
      const serie: SeriesEntity = {
        idSessao: 1,
        idExercicio: 10,
        numeroSerie: 1,
        tempoIsometriaSeg: 20,
        repsRealizadas: null,
      };

      const resultado = SeriesExecutionHelper.isIsometricaPura(serie);

      expect(resultado).toBe(true);
    });

    it('deve retornar false se houver repetições dinâmicas junto do tempo de isometria', () => {
      const serie: SeriesEntity = {
        idSessao: 1,
        idExercicio: 10,
        numeroSerie: 1,
        tempoIsometriaSeg: 20,
        repsRealizadas: 5,
      };

      const resultado = SeriesExecutionHelper.isIsometricaPura(serie);

      expect(resultado).toBe(false);
    });

    it('deve retornar false se o tempo de isometria for zero, nulo ou indefinido', () => {
      const serieZero: SeriesEntity = {
        idSessao: 1,
        idExercicio: 10,
        numeroSerie: 1,
        tempoIsometriaSeg: 0,
      };

      const serieNulla: SeriesEntity = {
        idSessao: 1,
        idExercicio: 10,
        numeroSerie: 1,
        tempoIsometriaSeg: null,
      };

      expect(SeriesExecutionHelper.isIsometricaPura(serieZero)).toBe(false);
      expect(SeriesExecutionHelper.isIsometricaPura(serieNulla)).toBe(false);
    });
  });

  describe('isDinamicaComPausa', () => {
    it('deve retornar true quando houver repetições e tempo de pausa isométrica por repetição', () => {
      const serie: SeriesEntity = {
        idSessao: 1,
        idExercicio: 5,
        numeroSerie: 1,
        repsRealizadas: 8,
        tempoPausaIsometricaSeg: 3,
      };

      const resultado = SeriesExecutionHelper.isDinamicaComPausa(serie);

      expect(resultado).toBe(true);
    });

    it('deve retornar false quando existirem repetições mas a pausa isométrica for nula ou zero', () => {
      const serieSemPausa: SeriesEntity = {
        idSessao: 1,
        idExercicio: 5,
        numeroSerie: 1,
        repsRealizadas: 8,
        tempoPausaIsometricaSeg: 0,
      };

      const resultado = SeriesExecutionHelper.isDinamicaComPausa(serieSemPausa);

      expect(resultado).toBe(false);
    });

    it('deve retornar false se houver pausa isométrica configurada mas repetições zeradas/nulas', () => {
      const serieSemReps: SeriesEntity = {
        idSessao: 1,
        idExercicio: 5,
        numeroSerie: 1,
        repsRealizadas: null,
        tempoPausaIsometricaSeg: 3,
      };

      const resultado = SeriesExecutionHelper.isDinamicaComPausa(serieSemReps);

      expect(resultado).toBe(false);
    });
  });
});