/// <reference types="jest" />
import request from 'supertest';
import { Application } from 'express';
import { createGraphQLServer } from '@src/presentation/graphql/server'; // Instância do servidor Express/Apollo
import { prisma } from '@src/lib/prisma';

describe('[E2E] Pessoa (GraphQL)', () => {
  let app: Application;

  beforeAll(async () => {
    ({ app } = await createGraphQLServer());
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve buscar os dados de uma pessoa pelo id', async () => {
    const query = `
      query BuscarPessoa($id: ID!) {
        obterPessoaPorId(id: $id) {
          id
          peso
          altura
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({
        query,
        variables: { id: 1 },
      });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
  });
});
