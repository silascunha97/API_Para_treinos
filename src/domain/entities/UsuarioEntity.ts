export interface IUsuarioProps {
  id?: number;
  nome: string;
  email: string;
  senhaHash: string;
  refreshTokenHash?: string | null;
  criadoEm?: Date;
  atualizadoEm?: Date | null;
}

export class Usuario {
  public readonly id: number | undefined;
  public readonly nome: string;
  public readonly email: string;
  public readonly senhaHash: string;
  public refreshTokenHash: string | null;
  public readonly criadoEm: Date;
  public atualizadoEm: Date | null;

  constructor(props: IUsuarioProps) {
    // 1. Sanitização prévia para validação
    const emailSanitizado = props.email ? props.email.trim().toLowerCase() : '';

    // 2. Guard Clauses (Validações de Regra de Negócio)
    if (!props.nome || props.nome.trim() === '') {
      throw new Error('O nome é obrigatório.');
    }

    if (!emailSanitizado || !this.validarEmail(emailSanitizado)) {
      throw new Error('Endereço de e-mail inválido.');
    }

    if (!props.senhaHash || props.senhaHash.trim() === '') {
      throw new Error('A senha hash é obrigatória.');
    }

    // 3. Atribuição de propriedades
    this.id = props.id;
    this.nome = props.nome.trim();
    this.email = emailSanitizado; // Atribui o e-mail já limpo e em minúsculo
    this.senhaHash = props.senhaHash;
    this.refreshTokenHash = props.refreshTokenHash ?? null;
    this.criadoEm = props.criadoEm ?? new Date();
    this.atualizadoEm = props.atualizadoEm ?? null;
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public atualizarRefreshToken(novoHash: string | null): void {
    this.refreshTokenHash = novoHash;
    this.atualizadoEm = new Date();
  }
}