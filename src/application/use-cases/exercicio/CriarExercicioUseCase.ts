import { IExercicioRepository } from '../../../domain/repositories/IExercicioRepository';
import { IExercicio as ExercicioEntity} from '../../../domain/entities/Exercicio';
export interface CriarExercicioDTO {
  nomeExercicio: string;
  grupoMuscular?: string;
  permiteCarga?: boolean;
}

export class CriarExercicioUseCase {
  constructor(private readonly exercicioRepository: IExercicioRepository) {}

  async execute(dto: CriarExercicioDTO): Promise<ExercicioEntity> {
    if (!dto.nomeExercicio || dto.nomeExercicio.trim() === '') {
      throw new Error('O nome do exercício é obrigatório.');
    }

    return await this.exercicioRepository.create({
      nomeExercicio: dto.nomeExercicio.trim(),
      grupoMuscular: dto.grupoMuscular?.trim() ?? '',
      permiteCarga: dto.permiteCarga ?? true,
    });
  }
}