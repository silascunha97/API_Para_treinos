export interface IPaginationParams {
  pagina: number;
  limite: number;
  ordenarPor?: string;
  ordem?: 'asc' | 'desc';
}

export interface IPaginatedResult<T> {
  dados: T[];
  meta: {
    totalRegistros: number;
    paginaAtual: number;
    limitePorPagina: number;
    totalPaginas: number;
    temProximaPagina: boolean;
    temPaginaAnterior: boolean;
  };
}