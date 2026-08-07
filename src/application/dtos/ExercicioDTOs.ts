export interface CreateExercicioDTO {
  nomeExercicio: string;
  grupoMuscular?: string;
  permiteCarga?: boolean;
}

export interface UpdateExercicioDTO {
  idExercicio: number;
  nomeExercicio?: string;
  grupoMuscular?: string;
  permiteCarga?: boolean;
}