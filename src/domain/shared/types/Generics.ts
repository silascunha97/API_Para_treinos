// Torna determinados campos opcionais
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Garante um tipo explicitamente anulável ou indefinido
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

// Wrapper genérico para respostas de operações da aplicação/API
export interface ApiResponse<T> {
  sucesso: boolean;
  dados?: T;
  erro?: {
    codigo: string;
    mensagem: string;
    detalhes?: unknown;
  };
}