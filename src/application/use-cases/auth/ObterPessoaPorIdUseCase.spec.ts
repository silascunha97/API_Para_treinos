import { ObterPessoaPorIdUseCase } from '../pessoa/ObterPessoaPorIdUseCase';
import { IPessoaRepository } from '../../../domain/repositories/IPessoaRepository';
import { Pessoa, IPessoaProps } from '../../../domain/entities/Pessoa';
import { UpdatePessoaDTO } from '@src/domain/dtos/PessoaDTOs';

// Assuming UpdatePessoaDTO is defined in the domain layer,
// but for this in-memory implementation, we define a compatible type
// based on the expected signature from IPessoaRepository.

class InMemoryPessoaRepository implements IPessoaRepository {
  public pessoas: Pessoa[] = [];
  private nextId = 1;

  async findById(id: number): Promise<Pessoa | null> {
    return this.pessoas.find((p) => p.id === id) || null;
  }

  async create(data: IPessoaProps): Promise<Pessoa> {
    const newPessoa = new Pessoa({ id: this.nextId++, ...data });
    this.pessoas.push(newPessoa);
    return newPessoa;
  }

  async update(data: UpdatePessoaDTO): Promise<Pessoa> {
    const index = this.pessoas.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error(`Pessoa with id ${data.id} not found.`);
    }
    const existingPessoa = this.pessoas[index]!;
    const updatedPessoa = new Pessoa({
      id: existingPessoa.id as number, // Asserting 'id' as number to satisfy IPessoaProps with exactOptionalPropertyTypes
      peso: data.peso !== undefined ? data.peso : existingPessoa.peso,
      altura: data.altura !== undefined ? data.altura : existingPessoa.altura,
      taxaMetabolicaBasal: data.taxaMetabolicaBasal !== undefined ? data.taxaMetabolicaBasal : existingPessoa.taxaMetabolicaBasal, // eslint-disable-line max-len
    });
    this.pessoas[index] = updatedPessoa;
    return updatedPessoa;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.pessoas.length;
    this.pessoas = this.pessoas.filter(p => p.id !== id);
    return this.pessoas.length < initialLength;
  }
}

describe('ObterPessoaPorIdUseCase', () => {
  let pessoaRepo: InMemoryPessoaRepository;
  let useCase: ObterPessoaPorIdUseCase;

  beforeEach(() => {
    pessoaRepo = new InMemoryPessoaRepository();
    useCase = new ObterPessoaPorIdUseCase(pessoaRepo);
  });

  it('deve retornar os dados da pessoa quando o ID existir', async () => {
    const pessoaData: IPessoaProps = {
      id: 1,
      peso: 76.5,
      altura: 1.78,
      taxaMetabolicaBasal: 1800,
    };
    pessoaRepo.pessoas.push(new Pessoa(pessoaData));

    const pessoa = await useCase.execute(1);

    expect(pessoa).toBeDefined();
    expect(pessoa.peso).toBe(76.5);
  });

  it('deve lançar exceção quando a pessoa não for encontrada', async () => {
    await expect(useCase.execute(999)).rejects.toThrow('Perfil de pessoa não encontrado.');
  });
});