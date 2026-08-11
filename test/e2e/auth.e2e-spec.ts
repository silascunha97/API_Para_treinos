import request from 'supertest';
import { Application } from 'express';
import { createGraphQLServer } from '../../src/presentation/graphql/server'; // Ajuste para '../../src/main/app' se seu arquivo Express estiver lá
import { prisma } from '../../src/lib/prisma';

describe('[E2E] Autenticação (GraphQL)', () => {
  let app: Application;

  const usuarioTeste = {
    nome: 'Augusto Silva',
    email: `augusto.e2e.${Date.now()}@teste.com`, // Email dinâmico para evitar conflitos de duplicidade em re-execuções
    senha: 'SenhaSegura123!',
  };

  let accessToken = '';

  beforeAll(async () => {
    // createGraphQLServer é assíncrono (registra o Apollo Server antes de expor o app);
    // é preciso aguardar a resolução para obter a instância Express real.
    ({ app } = await createGraphQLServer());
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    const mutation = `
      mutation Registrar($input: RegistrarInput!) {
        registrar(input: $input) {
          usuario {
            id
            nome
            email
          }
          accessToken
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: usuarioTeste,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.registrar.usuario).toMatchObject({
      nome: usuarioTeste.nome,
      email: usuarioTeste.email,
    });
    expect(response.body.data.registrar.accessToken).toBeDefined();
  });

  it('deve realizar login com credenciais válidas e retornar o accessToken JWT', async () => {
    const mutation = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: {
            email: usuarioTeste.email,
            senha: usuarioTeste.senha,
          },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login.accessToken).toBeDefined();

    // Armazena o Bearer token retornado para uso no teste de query protegida
    accessToken = response.body.data.login.accessToken;
  });

  it('deve recusar o login e retornar erro quando a senha for incorreta', async () => {
    const mutation = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: {
            email: usuarioTeste.email,
            senha: 'SenhaIncorreta123!',
          },
        },
      });

    expect(response.status).toBe(200); // Em GraphQL erros de regra de negócio retornam 200 com o array "errors"
    expect(response.body.errors).toBeDefined();
    expect(response.body.data).toBeNull();
  });

  it('deve acessar uma query protegida enviando o Bearer token no cabeçalho Authorization', async () => {
    const query = `
      query Me {
        me {
          email
          nome
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`) // Injeção do Bearer Token no Header
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.me).toEqual({
      nome: usuarioTeste.nome,
      email: usuarioTeste.email,
    });
  });

  it('deve rejeitar acesso a uma query protegida sem o cabeçalho Authorization', async () => {
    const query = `
      query Me {
        me {
          email
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({ query }); // Sem enviar o token

    // O guard requireAuth (src/presentation/graphql/guards/graph.guards.ts) define
    // explicitamente extensions.http.status = 401 para erros UNAUTHENTICATED, então
    // a resposta HTTP reflete o código real, e não o 200 "genérico" do GraphQL.
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
  });
});
