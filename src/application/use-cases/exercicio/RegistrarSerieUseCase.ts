import { ISerieRepository } from '../../../domain/repositories/ISerieRepository';
import { RegistrarSerieDTO, SerieResponseDTO } from '../../../domain/dtos/SerieDTOs';
import { SeriesEntity } from '../../../domain/entities/Serie';

export class RegistrarSerieUseCase {
  constructor(private readonly seriesRepository: ISerieRepository) {}

  async execute(dto: RegistrarSerieDTO): Promise<SerieResponseDTO> {
    // 1. Validação de Métrica Mínima
    const temReps = dto.repsRealizadas !== undefined && dto.repsRealizadas > 0;
    const temIsometria = dto.tempoIsometriaSeg !== undefined && dto.tempoIsometriaSeg > 0;

    if (!temReps && !temIsometria) {
      throw new Error('A série deve conter repetições registradas ou tempo de isometria.');
    }

    // 2. Persistência (Submetendo null para métricas opcionais ausentes)
    const novaSerie: SeriesEntity = await this.seriesRepository.create({
      idSessao: dto.idSessao,
      idExercicio: dto.idExercicio,
      numeroSerie: dto.numeroSerie,
      repsRealizadas: dto.repsRealizadas ?? null,
      tempoIsometriaSeg: dto.tempoIsometriaSeg ?? null,
      tempoPausaIsometricaSeg: dto.tempoPausaIsometricaSeg ?? null,
      cargaAdicional: dto.cargaAdicional ?? null,
      concluido: dto.concluido ?? true, // Uma série recém-registrada é considerada concluída por padrão
    });

    // 3. Inferência do tipo de execução
    let tipoExecucao: 'DINAMICA' | 'ISOMETRICA' | 'DINAMICA_COM_PAUSA_ISOMETRICA' = 'DINAMICA';

    if (temReps && dto.tempoPausaIsometricaSeg && dto.tempoPausaIsometricaSeg > 0) {
      tipoExecucao = 'DINAMICA_COM_PAUSA_ISOMETRICA';
    } else if (temIsometria && !temReps) {
      tipoExecucao = 'ISOMETRICA';
    } 

    return {
      idSerie: novaSerie.idSerie!,
      idSessao: novaSerie.idSessao,
      idExercicio: novaSerie.idExercicio,
      numeroSerie: novaSerie.numeroSerie,
      repsRealizadas: novaSerie.repsRealizadas ?? null,
      tempoIsometriaSeg: novaSerie.tempoIsometriaSeg ?? null,
      tempoPausaIsometricaSeg: novaSerie.tempoPausaIsometricaSeg ?? null,
      cargaAdicional: novaSerie.cargaAdicional ?? null,
      concluido: novaSerie.concluido ?? true,
      tipoExecucaoSinalizada: tipoExecucao,
    };
  }
}