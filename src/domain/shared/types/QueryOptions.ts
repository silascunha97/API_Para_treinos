export type WhereConditions<T> = {
  [K in keyof T]?: T[K] | T[K][] | undefined;
};

export interface IQueryOptions<T> {
  onde?: WhereConditions<T>;
  incluir?: (keyof T)[];
  ordenarPor?: {
    campo: keyof T;
    direcao: 'asc' | 'desc';
  };
}