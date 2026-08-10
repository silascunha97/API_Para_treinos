import { CriarExercicioUseCase } from '../exercicio/CriarExercicioUseCase';
import { IExercicioRepository } from '../../../domain/repositories/IExercicioRepository';
import { Exercicio, IExercicioProps } from '../../../domain/entities/Exercicio';

// Assuming UpdateExercicioDTO is defined in the domain layer,
// but for this in-memory implementation, we define a compatible type
// based on the expected signature from IExercicioRepository.
interface UpdateExercicioDTO {
  idExercicio: number;
  nomeExercicio?: string;
  grupoMuscular?: string;
  permiteCarga?: boolean;
  tipoExercicio?: 'DINAMICO' | 'ISOMETRICO';
}
class InMemoryExercicioRepository implements IExercicioRepository {
  public exercicios: Exercicio[] = [];
  private nextId = 1;

  async create(data: IExercicioProps): Promise<Exercicio> {
    const exercicio = new Exercicio({ idExercicio: this.nextId++, ...data });
    this.exercicios.push(exercicio);
    return Promise.resolve(exercicio);
  }

  async findById(id: number): Promise<Exercicio | null> {
    return Promise.resolve(this.exercicios.find(e => e.idExercicio === id) ?? null);
  }

  async findAll(): Promise<Exercicio[]> {
    return Promise.resolve(this.exercicios);
  }

  async update(data: UpdateExercicioDTO): Promise<Exercicio> {
    const index = this.exercicios.findIndex(e => e.idExercicio === data.idExercicio);
    if (index === -1) {
      throw new Error(`Exercicio with id ${data.idExercicio} not found.`);
    }
    const existingExercicio: Exercicio = this.exercicios[index]!;
    // Ensure required properties (nomeExercicio, grupoMuscular) are always present
    // by falling back to existing values if not provided in data. 
    const updatedExercicio = new Exercicio({ 
      nomeExercicio: data.nomeExercicio ?? existingExercicio.nomeExercicio,
      grupoMuscular: data.grupoMuscular ?? existingExercicio.grupoMuscular,
      permiteCarga: data.permiteCarga ?? existingExercicio.permiteCarga,
      tipoExercicio: data.tipoExercicio ?? existingExercicio.tipoExercicio,
      // Ensure ID is preserved and explicitly cast to number to satisfy IExercicioProps
      // (though Exercicio constructor allows undefined for idExercicio)
      idExercicio: existingExercicio.idExercicio as number,
    });
    this.exercicios[index] = updatedExercicio;
    return Promise.resolve(updatedExercicio);
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.exercicios.length;
    this.exercicios = this.exercicios.filter(e => e.idExercicio !== id);
    return Promise.resolve(this.exercicios.length < initialLength);
  }
}

describe('CriarExercicioUseCase', () => {
  let exercicioRepo: InMemoryExercicioRepository;
  let useCase: CriarExercicioUseCase;

  beforeEach(() => {
    exercicioRepo = new InMemoryExercicioRepository();
    useCase = new CriarExercicioUseCase(exercicioRepo);
  });

  it('deve criar um exercício de calistenia com sucesso', async () => {
    const input = {
      nomeExercicio: 'Barra Fixa com Carga',
      grupoMuscular: 'Costas',
      permiteCarga: true,
      tipoExercicio: 'DINAMICO' as const,
    };

    const exercicio = await useCase.execute(input);

    expect(exercicio).toHaveProperty('idExercicio');
    expect(exercicio.nomeExercicio).toBe('Barra Fixa com Carga');
    expect(exercicioRepo.exercicios).toHaveLength(1);
  });
});