import { IMessageQueueProvider } from '../../../domain/providers/IMessageQueueProvider';

// Define a placeholder interface for ISessaoTreino and ISessaoTreinoRepository
// This assumes that a dedicated repository for sessions exists or should exist,
// and it contains the 'finalizarSessao' method.
interface ISessaoTreino {
  idSessao: number;
  idPessoa: number;
  // Add any other properties that sessaoTreinoRepository.finalizarSessao might return
}

interface ISessaoTreinoRepository {
  finalizarSessao(idSessao: number, idPessoa: number): Promise<ISessaoTreino>;
}

export class FinalizarSessaoTreinoUseCase {
  constructor(
    private sessaoTreinoRepository: ISessaoTreinoRepository,
    private queueProvider: IMessageQueueProvider
  ) {}

  async execute(idSessao: number, idPessoa: number) {
    // 1. Finaliza a sessão no banco PostgreSQL
    const sessaoFinalizada = await this.sessaoTreinoRepository.finalizarSessao(idSessao, idPessoa);

    // 2. Dispara evento assíncrono para a fila no RabbitMQ sem travar a resposta
    await this.queueProvider.publish('sessao_treino_finalizada', {
      idSessao: sessaoFinalizada.idSessao,
      idPessoa,
      finalizadaEm: new Date(),
    });

    return sessaoFinalizada;
  }
}