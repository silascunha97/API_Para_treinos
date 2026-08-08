import { RabbitMQAdapter } from '../providers/RabbitMQAdapter';

const rabbitMQ = new RabbitMQAdapter(process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672');

interface SessaoTreinoFinalizadaMessage {
  idSessao: number;
  idPessoa: number;
  finalizadaEm: string; // Date is serialized to string by JSON.stringify
}

export async function startTreinoWorkers() {
  console.log('⚡ [Worker] Registrando consumidor para a fila sessao_treino_finalizada...');

  await rabbitMQ.consume('sessao_treino_finalizada', async (message: unknown) => {
    const data = message as SessaoTreinoFinalizadaMessage;
    console.log(`[Worker] Processando métricas para a Sessão #${data.idSessao} da Pessoa #${data.idPessoa}...`);
    
    // Aqui entra a lógica pesada de cálculo de volume de treino / estatísticas físicas
    // Por exemplo:
    // const sessao = await sessaoTreinoRepository.findById(data.idSessao);
  });
}