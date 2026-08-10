import { Pessoa } from './Pessoa';

describe('Pessoa Entity', () => {
  it('deve instanciar uma pessoa com os atributos numéricos válidos', () => {
    const pessoa = new Pessoa({
      id: 1, // Adicionado para satisfazer a interface IPessoa
      peso: 76.5,
      altura: 1.78,
      taxaMetabolicaBasal: 1800,
    });

    expect(pessoa.id).toBe(1);
    expect(pessoa.peso).toBe(76.5);
    expect(pessoa.altura).toBe(1.78);
    expect(pessoa.taxaMetabolicaBasal).toBe(1800);
  });

  it('deve lançar exceção se peso ou altura forem valores negativos ou zero', () => {
    expect(() => {
      new Pessoa({
        id: 1, // Adicionado para satisfazer a interface IPessoa
        peso: -5,
        altura: 1.75,
        taxaMetabolicaBasal: 1800,
      });
    }).toThrow('Peso e altura devem ser valores positivos.');
  });
});