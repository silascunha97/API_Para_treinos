import { IExercicioRepository } from '../../../domain/repositories/IExercicioRepository';
import { IExercicio as ExercicioEntity} from '../../../domain/entities/Exercicio';

export class ListarExerciciosUseCase {
  constructor(private readonly exercicioRepository: IExercicioRepository) {}

  async execute(): Promise<ExercicioEntity[]> {
    return await this.exercicioRepository.findAll();
  }
}