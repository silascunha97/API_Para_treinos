import { SessaoTreino } from './SessaoTreino';

describe('SessaoTreino Entity', () => {
  it('deve criar uma sessão de treino aberta sem data de término', () => {
    const inicio = new Date('2026-08-10T14:00:00Z');
    const sessao = new SessaoTreino({
      idPessoa: 1,
      dataHoraInicio: inicio,
      observacoes: 'Foco em calistenia - Puxadas pesadas',
    });

    expect(sessao.idPessoa).toBe(1);
    expect(sessao.dataHoraInicio).toEqual(inicio);
    expect(sessao.dataHoraFim).toBeNull();
    expect(sessao.observacoes).toBe('Foco em calistenia - Puxadas pesadas');
  });

  it('deve encerrar a sessão atribuindo a data/hora final válida', () => {
    const inicio = new Date('2026-08-10T14:00:00Z');
    const fim = new Date('2026-08-10T15:30:00Z');

    const sessao = new SessaoTreino({
      idPessoa: 1,
      dataHoraInicio: inicio,
    });

    sessao.finalizar(fim);

    expect(sessao.dataHoraFim).toEqual(fim);
  });

  it('deve assumir a data/hora atual se nenhuma data for fornecida ao finalizar', () => {
    const inicio = new Date('2026-08-10T14:00:00Z');
    const sessao = new SessaoTreino({
      idPessoa: 1,
      dataHoraInicio: inicio,
    });

    sessao.finalizar();

    expect(sessao.dataHoraFim).toBeInstanceOf(Date);
    expect(sessao.dataHoraFim!.getTime()).toBeGreaterThanOrEqual(inicio.getTime());
  });

  it('não deve permitir encerrar a sessão com horário anterior ao horário de início', () => {
    const inicio = new Date('2026-08-10T14:00:00Z');
    const fimInvalido = new Date('2026-08-10T13:00:00Z');

    const sessao = new SessaoTreino({
      idPessoa: 1,
      dataHoraInicio: inicio,
    });

    expect(() => {
      sessao.finalizar(fimInvalido);
    }).toThrow('A data de término não pode ser anterior ao início do treino.');
  });
});