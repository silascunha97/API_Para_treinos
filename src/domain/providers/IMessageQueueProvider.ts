export interface IMessageQueueProvider {
  publish(queue: string, message: unknown): Promise<void>;
  consume(queue: string, callback: (message: any) => Promise<void>): Promise<void>;
}