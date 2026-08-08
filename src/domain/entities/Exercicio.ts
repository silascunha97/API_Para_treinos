export interface IExercicio {
  idExercicio: number;
  nomeExercicio: string;
  grupoMuscular?: string | null;
  permiteCarga: boolean;
}