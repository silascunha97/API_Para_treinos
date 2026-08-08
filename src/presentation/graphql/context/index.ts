import { Request } from 'express';
import { JwtAdapter } from '../../../infrastructure/providers/JwtAdapter';
import { TokenPayload } from '../../../domain/providers/ITokenProvider';

export interface GraphQLContext {
  usuario: TokenPayload | null;
}

const jwtAdapter = new JwtAdapter(
  process.env.JWT_ACCESS_SECRET || 'secret_access_key',
  process.env.JWT_REFRESH_SECRET || 'secret_refresh_key'
);

export async function buildGraphQLContext({ req }: { req: Request }): Promise<GraphQLContext> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { usuario: null };
  }

  const token = authHeader.split(' ')[1];
  // Ensure token is a string before passing it to verifyAccessToken
  if (!token) {
    return { usuario: null };
  }
  const payload = jwtAdapter.verifyAccessToken(token);

  return { usuario: payload };
}