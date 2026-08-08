export interface GraphQLContext {
  req: Express.Request;
  usuarioId?: number;
}