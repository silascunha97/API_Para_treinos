import { BcryptAdapter } from './BcryptAdapter';

describe('BcryptAdapter (Infra Implementation)', () => {
  let hasher: BcryptAdapter;

  beforeEach(() => {
    hasher = new BcryptAdapter(8); // Salt rounds menor para rodar rápido no Jest
  });

  it('deve gerar um hash para a senha e validar com sucesso', async () => {
    const senhaLimpa = 'MinhaSenhaSegura123';
    const hash = await hasher.hash(senhaLimpa);

    expect(hash).not.toBe(senhaLimpa);
    
    const ehValida = await hasher.compare(senhaLimpa, hash);
    expect(ehValida).toBe(true);
  });

  it('deve retornar false se a senha fornecida for incorreta', async () => {
    const hash = await hasher.hash('SenhaCerta123');
    const ehValida = await hasher.compare('SenhaErrada123', hash);

    expect(ehValida).toBe(false);
  });
});