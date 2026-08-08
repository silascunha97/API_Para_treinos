export interface CriarContaDTO {
  nome: string;
  email: string;
  senha: string;
  idPessoa?: number;
}

export interface AutenticarDTO {
  email: string;
  senha: string;
}

export interface AuthResponseDTO {
  usuario: {
    id: number;
    nome: string;
    email: string;
    idPessoa?: number | null;
  };
  accessToken: string;
  refreshToken: string;
}