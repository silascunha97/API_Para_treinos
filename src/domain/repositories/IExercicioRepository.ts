import { IExercicio } from '../entities/Exercicio';
import { CreateExercicioDTO, UpdateExercicioDTO } from '../dtos/ExercicioDTOs';

export interface IExercicioRepository {
  findById(idExercicio: number): Promise<IExercicio | null>;
  findAll(): Promise<IExercicio[]>;
  create(data: CreateExercicioDTO): Promise<IExercicio>;
  update(data: UpdateExercicioDTO): Promise<IExercicio>;
  delete(idExercicio: number): Promise<boolean>;
}