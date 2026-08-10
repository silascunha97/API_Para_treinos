import { Exercicio } from './Exercicio';

describe('Exercicio Entity', () => {
  it('deve instanciar um exercício válido com os valores padrão', () => {
    const exercicio = new Exercicio({
      nomeExercicio: 'Barra Fixa',
      grupoMuscular: 'Costas',
    });

    expect(exercicio.nomeExercicio).toBe('Barra Fixa');
    expect(exercicio.grupoMuscular).toBe('Costas');
    expect(exercicio.permiteCarga).toBe(true);
    expect(exercicio.tipoExercicio).toBe('DINAMICO');
  });

  it('deve lançar erro se o nome do exercício não for informado ou for vazio', () => {
    expect(() => {
      const exercicio = new Exercicio({

        idExercicio: 1, // Adicionado para satisfazer a interface IExercicio
        nomeExercicio: '',
        grupoMuscular: 'Peito',
        permiteCarga: true, // Adicionado para satisfazer a interface IExercicio
      });
    }).toThrow('O nome do exercício é obrigatório.');
  });
});