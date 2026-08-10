import { Request } from 'express';
import { jwtAdapter } from '../../../main/factories/authFactory';
import { TokenPayload } from '../../../domain/providers/ITokenProvider';

export interface GraphQLContext {
  usuario: TokenPayload | null;
}

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