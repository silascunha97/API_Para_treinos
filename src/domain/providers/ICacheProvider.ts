export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlInSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  delByPrefix(prefix: string): Promise<void>;
}