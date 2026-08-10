import { IPessoaRepository } from '../../src/domain/repositories/IPessoaRepository';
import { IPessoa } from '../../src/domain/entities/Pessoa';

export class InMemoryPessoaRepository implements IPessoaRepository {
  public items: IPessoa[] = [];

  async findById(id: number): Promise<IPessoa | null> {
    const pessoa = this.items.find((item) => item.id === id);
    return pessoa ?? null;
  }

  async create(data: Omit<IPessoa, 'id'>): Promise<IPessoa> {
    const novaPessoa: IPessoa = {
      id: this.items.length + 1,
      peso: data.peso ?? null,
      altura: data.altura ?? null,
      taxaMetabolicaBasal: data.taxaMetabolicaBasal ?? null,
    };

    this.items.push(novaPessoa);
    return novaPessoa;
  }
  // The original update method signature in IPessoaRepository is `update(data: UpdatePessoaDTO): Promise<IPessoa>;`
  // This in-memory implementation uses `id` and `Partial<IPessoa>` which is different.
  // For the purpose of fixing the `PessoaEntity` error, I'll adapt this method to use `IPessoa`.
  // If the goal was to strictly adhere to `IPessoaRepository`'s `update` signature, `UpdatePessoaDTO` would be needed.
  async update(data: { id: number } & Partial<IPessoa>): Promise<IPessoa> {
    const { id, ...updateData } = data;
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Pessoa não encontrada.');
    }

    this.items[index] = {
      ...this.items[index],
      ...updateData,
    };

    return this.items[index];
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);

    if (this.items.length < initialLength) {
      return true; // Item was found and deleted
    }
    return false; // Item was not found
  }
}