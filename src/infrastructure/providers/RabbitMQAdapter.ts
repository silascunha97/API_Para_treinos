import amqp, {
  Channel,
  ChannelModel,
  ConsumeMessage,
} from 'amqplib';

import { IMessageQueueProvider } from '../../domain/providers/IMessageQueueProvider';

export class RabbitMQAdapter implements IMessageQueueProvider {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private readonly uri: string) {}

  private async connect(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }

    const connection = await amqp.connect(this.uri);

    this.connection = connection;
    this.channel = await connection.createChannel();

    return this.channel;
  }

  async publish(
    queue: string,
    message: unknown,
  ): Promise<void> {
    const channel = await this.connect();

    await channel.assertQueue(queue, {
      durable: true,
    });

    const buffer = Buffer.from(
      JSON.stringify(message),
    );

    channel.sendToQueue(queue, buffer, {
      persistent: true,
    });
  }

  async consume(
    queue: string,
    callback: (message: unknown) => Promise<void>,
  ): Promise<void> {
    const channel = await this.connect();

    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.consume(
      queue,
      async (msg: ConsumeMessage | null) => {
        if (!msg) {
          return;
        }

        try {
          const content = JSON.parse(
            msg.content.toString(),
          );

          await callback(content);

          channel.ack(msg);
        } catch (error) {
          console.error(
            `[RabbitMQ] Erro ao processar mensagem da fila ${queue}:`,
            error,
          );

          channel.nack(msg, false, false);
        }
      },
    );
  }
}