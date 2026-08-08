import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import { Prisma } from './generated/prisma/client';
import { prisma } from './lib/prisma';

const serializeDecimal = (value: unknown) => {
  if (value == null) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number(value);
  }

  if (typeof value === 'object' && value !== null && 'toString' in value) {
    return Number((value as { toString: () => string }).toString());
  }

  return value;
};

// 1. Definição do Schema GraphQL
const typeDefs = `#graphql
  type Pessoa {
    id: Int!
    peso: Float
    altura: Float
    taxaMetabolicaBasal: Float
  }

  type Exercicio {
    idExercicio: Int!
    nomeExercicio: String!
    grupoMuscular: String
    permiteCarga: Boolean!
  }

  type SessaoTreino {
    idSessao: Int!
    idPessoa: Int!
    dataHoraInicio: String!
    dataHoraFim: String
    observacoes: String
  }

  type Series {
    idSerie: Int!
    idSessao: Int!
    idExercicio: Int!
    numeroSerie: Int!
    repsRealizadas: Int
    cargaAdicional: Float
    concluido: Boolean
  }

  input PessoaInput {
    peso: Float
    altura: Float
    taxaMetabolicaBasal: Float
  }

  input ExercicioInput {
    nomeExercicio: String!
    grupoMuscular: String
    permiteCarga: Boolean
  }

  input SessaoTreinoInput {
    idPessoa: Int!
    dataHoraInicio: String!
    dataHoraFim: String
    observacoes: String
  }

  input SeriesInput {
    idSessao: Int!
    idExercicio: Int!
    numeroSerie: Int!
    repsRealizadas: Int
    cargaAdicional: Float
    concluido: Boolean
  }

  type Query {
    healthCheck: String!
    pessoas: [Pessoa!]!
    exercicios: [Exercicio!]!
    sessoesTreino: [SessaoTreino!]!
    series: [Series!]!
  }

  type Mutation {
    createPessoa(input: PessoaInput!): Pessoa!
    createExercicio(input: ExercicioInput!): Exercicio!
    createSessaoTreino(input: SessaoTreinoInput!): SessaoTreino!
    createSeries(input: SeriesInput!): Series!
  }
`;

// 2. Resolvers (Lógica das requisições)
const resolvers = {
  Query: {
    healthCheck: () => 'API GraphQL Express com TS rodando perfeitamente!',
    pessoas: async () => {
      const pessoas = await prisma.pessoa.findMany();
      return pessoas.map((pessoa) => ({
        ...pessoa,
        peso: serializeDecimal(pessoa.peso),
        altura: serializeDecimal(pessoa.altura),
        taxaMetabolicaBasal: serializeDecimal(pessoa.taxaMetabolicaBasal),
      }));
    },
    exercicios: async () => {
      const exercicios = await prisma.exercicio.findMany();
      return exercicios.map((exercicio) => ({
        ...exercicio,
      }));
    },
    sessoesTreino: async () => {
      const sessoes = await prisma.sessaoTreino.findMany();
      return sessoes.map((sessao) => ({
        ...sessao,
        dataHoraInicio: sessao.dataHoraInicio.toISOString(),
        dataHoraFim: sessao.dataHoraFim ? sessao.dataHoraFim.toISOString() : null,
      }));
    },
    series: async () => {
      const series = await prisma.series.findMany();
      return series.map((item) => ({
        ...item,
        cargaAdicional: serializeDecimal(item.cargaAdicional),
      }));
    },
  },
  Mutation: {
    createPessoa: async (_root: unknown, { input }: { input: { peso?: number; altura?: number; taxaMetabolicaBasal?: number } }) => {
      const data: Prisma.PessoaCreateInput = {};

      if (input.peso !== undefined) {
        data.peso = input.peso;
      }

      if (input.altura !== undefined) {
        data.altura = input.altura;
      }

      if (input.taxaMetabolicaBasal !== undefined) {
        data.taxaMetabolicaBasal = input.taxaMetabolicaBasal;
      }

      const created = await prisma.pessoa.create({ data });

      return {
        ...created,
        peso: serializeDecimal(created.peso),
        altura: serializeDecimal(created.altura),
        taxaMetabolicaBasal: serializeDecimal(created.taxaMetabolicaBasal),
      };
    },
    createExercicio: async (_root: unknown, { input }: { input: { nomeExercicio: string; grupoMuscular?: string | null; permiteCarga?: boolean } }) => {
      const data: Prisma.ExercicioCreateInput = {
        nomeExercicio: input.nomeExercicio,
      };

      if (input.grupoMuscular !== undefined) {
        data.grupoMuscular = input.grupoMuscular;
      }

      if (input.permiteCarga !== undefined) {
        data.permiteCarga = input.permiteCarga;
      }

      return prisma.exercicio.create({ data });
    },
    createSessaoTreino: async (_root: unknown, { input }: { input: { idPessoa: number; dataHoraInicio: string; dataHoraFim?: string | null; observacoes?: string | null } }) => {
      const data: Prisma.SessaoTreinoCreateInput = {
        dataHoraInicio: new Date(input.dataHoraInicio),
        pessoa: {
          connect: { id: input.idPessoa },
        },
      };

      if (input.dataHoraFim !== undefined) {
        data.dataHoraFim = input.dataHoraFim ? new Date(input.dataHoraFim) : null;
      }

      if (input.observacoes !== undefined) {
        data.observacoes = input.observacoes;
      }

      const created = await prisma.sessaoTreino.create({ data });
      return {
        ...created,
        dataHoraInicio: created.dataHoraInicio.toISOString(),
        dataHoraFim: created.dataHoraFim ? created.dataHoraFim.toISOString() : null,
      };
    },
    createSeries: async (_root: unknown, { input }: { input: { idSessao: number; idExercicio: number; numeroSerie: number; repsRealizadas?: number | null; cargaAdicional?: number | null; concluido?: boolean | null } }) => {
      const data: Prisma.SeriesCreateInput = {
        numeroSerie: input.numeroSerie,
        sessao: {
          connect: { idSessao: input.idSessao },
        },
        exercicio: {
          connect: { idExercicio: input.idExercicio },
        },
      };

      if (input.repsRealizadas !== undefined) {
        data.repsRealizadas = input.repsRealizadas;
      }

      if (input.cargaAdicional !== undefined) {
        data.cargaAdicional = input.cargaAdicional;
      }

      if (input.concluido !== undefined) {
        data.concluido = input.concluido;
      }

      const created = await prisma.series.create({ data });
      return {
        ...created,
        cargaAdicional: serializeDecimal(created.cargaAdicional),
      };
    },
  },
};

async function bootstrap() {
  const app = express();
  const PORT = process.env.PORT || 4000;

  // Testa a conexão com o banco de dados antes de subir o servidor
  await prisma.$connect();
  console.log('🐘 Conectado ao PostgreSQL via Prisma');

  // 3. Instância do Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // 4. Integrar Apollo ao Express via Middleware
  app.use(express.json());
  app.use('/graphql', cors<cors.CorsRequest>(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});

// Encerra a conexão com o banco de dados de forma limpa ao finalizar o processo
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});