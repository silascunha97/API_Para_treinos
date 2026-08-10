import { ISessaoTreinoRepository } from '../../../domain/shared/repositories/ISessaoTreinoRepository';
import { ISerieRepository } from '../../../domain/shared/repositories/ISerieRepository';
import { IMessageQueueProvider } from '../../../domain/providers/IMessageQueueProvider';

export class FinalizarSessaoTreinoUseCase {
  constructor(
    private readonly sessaoTreinoRepository: ISessaoTreinoRepository,
    private readonly seriesRepository: ISerieRepository,
    private readonly queueProvider: IMessageQueueProvider
  ) {}

  async execute(idSessao: number, idPessoa: number) {
    const sessao = await this.sessaoTreinoRepository.findById(idSessao);
    if (!sessao || sessao.idPessoa !== idPessoa) {
      throw new Error('Sessão de treino não encontrada ou não pertence ao usuário.');
    }

    // Busca todas as séries realizadas para validar / calcular métricas iniciais
    const seriesRealizadas = await this.seriesRepository.findBySessaoId(idSessao);

    const sessaoFinalizada = await this.sessaoTreinoRepository.update({
      idSessao,
      dataHoraFim: new Date(),
    });

    // Dispara o evento com o contexto das séries para o Worker processar em background
    await this.queueProvider.publish('sessao_treino_finalizada', {
      idSessao: sessaoFinalizada.idSessao,
      idPessoa,
      totalSeries: seriesRealizadas.length,
      finalizadoEm: new Date(),
    });

    return sessaoFinalizada;
  }
}
