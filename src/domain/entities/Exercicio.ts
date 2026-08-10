export interface IExercicioProps {
  idExercicio?: number;
  nomeExercicio: string;
  grupoMuscular: string;
  permiteCarga?: boolean;
  tipoExercicio?: 'DINAMICO' | 'ISOMETRICO';
}

export class Exercicio {
  public readonly idExercicio: number | undefined;
  public readonly nomeExercicio: string;
  public readonly grupoMuscular: string;
  public readonly permiteCarga: boolean;
  public readonly tipoExercicio: 'DINAMICO' | 'ISOMETRICO';

  constructor(props: IExercicioProps) {
    // ⚠️ Guard Clause: Validação exigida pelo teste unitário
    if (!props.nomeExercicio || props.nomeExercicio.trim() === '') {
      throw new Error('O nome do exercício é obrigatório.');
    }

    this.idExercicio = props.idExercicio;
    this.nomeExercicio = props.nomeExercicio;
    this.grupoMuscular = props.grupoMuscular;
    this.permiteCarga = props.permiteCarga ?? true;
    this.tipoExercicio = props.tipoExercicio ?? 'DINAMICO';
  }
}