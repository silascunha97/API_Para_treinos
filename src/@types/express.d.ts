declare global {
  namespace Express {
    interface Request {
      usuarioId?: number;
      token?: string;
    }
  }
}

export {};