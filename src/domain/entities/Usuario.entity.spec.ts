import { Usuario } from './UsuarioEntity';

describe('Usuario Entity', () => {
  it('deve instanciar um usuário válido e sanitizar o e-mail', () => {
    const usuario = new Usuario({
      nome: 'Augusto Silva',
      email: '  Augusto@Teste.Com ',
      senhaHash: '$2b$10$hashSeguro123',
    });

    expect(usuario.nome).toBe('Augusto Silva');
    expect(usuario.email).toBe('augusto@teste.com'); // E-mail normalizado em caixa baixa
    expect(usuario.senhaHash).toBe('$2b$10$hashSeguro123');
    expect(usuario.criadoEm).toBeInstanceOf(Date);
    expect(usuario.refreshTokenHash).toBeNull();
  });

  it('deve lançar exceção se o nome for vazio', () => {
    expect(() => {
      new Usuario({
        nome: '',
        email: 'augusto@teste.com',
        senhaHash: 'hash123',
      });
    }).toThrow('O nome é obrigatório.');
  });

  it('deve lançar exceção se o e-mail tiver formato inválido', () => {
    expect(() => {
      new Usuario({
        nome: 'Augusto',
        email: 'email_invalido_sem_arroba',
        senhaHash: 'hash123',
      });
    }).toThrow('Endereço de e-mail inválido.');
  });

  it('deve atualizar o refreshTokenHash e atualizar o timestamp de alteração', () => {
    const usuario = new Usuario({
      nome: 'Augusto',
      email: 'augusto@teste.com',
      senhaHash: 'hash123',
    });

    const novoHash = 'novo_refresh_token_hash_abc';
    usuario.atualizarRefreshToken(novoHash);

    expect(usuario.refreshTokenHash).toBe(novoHash);
    expect(usuario.atualizadoEm).toBeInstanceOf(Date);
  });
});