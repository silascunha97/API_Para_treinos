# 🚀 Workout Tracker API (Express + GraphQL + PostgreSQL + Prisma)

> **Documentação Viva & Roteiro de Concepção**  
> Sistema de rastreamento de treinos de alta performance, focado em progressão de carga, volume semanal e análise estética/estrutural.

---

## 🚀 MVP Release v1.0.0 — API para Treinos

Esta Pull Request entrega o **MVP (Minimum Viable Product)** da API de Treinos. A aplicação foi desenvolvida aplicando os princípios de **Clean Architecture**, **Domain-Driven Design (DDD)**, e integração entre **GraphQL (Apollo Server v4)**, **Express** e **Prisma ORM** com banco de dados **PostgreSQL**.

---

## 📋 Entidades do Domínio e Relacionamentos Implementados

A aplicação engloba o ciclo completo de monitoramento de treinos conforme a modelagem de domínio:

* 👤 **Pessoa:** Armazena perfil físico e métricas do atleta (`peso`, `altura`, `taxaMetabolicaBasal`).
* 🏋️ **Exercicio:** Catálogo de exercícios com suporte a grupos musculares e flag de carga adicional (`permiteCarga`).
* ⏱️ **SessaoTreino:** Gerencia o ciclo de treino iniciado por uma pessoa (`dataHoraInicio`, `dataHoraFim`, `observacoes`).
* 🔢 **Serie:** Registra o progresso de cada exercício executado dentro de uma sessão (`numeroSerie`, `repsRealizadas`, `cargaAdicional`, `concluido`).

---

## 🏗️ Destaques da Arquitetura

1. **Clean Architecture / Camadas Isoladas:**
   * `/domain`: Entidades puras e contratos dos repositórios (`IBaseRepository`, `IPessoaRepository`, etc.).
   * `/application`: DTOs de entrada/saída e Casos de Uso (`Use Cases`) isolando as regras de negócio.
   * `/infrastructure`: Instância *Singleton* do `PrismaClient` para evitar *connection leaks* e implementação concreta dos repositórios.
   * `/presentation`: Schemas GraphQL (`typeDefs`), Resolvers e Middleware de formatação/sanitização global de erros (`formatError`).
   * `/main`: Injeção de dependências (*Factories*) e inicialização do servidor HTTP/GraphQL (`app.ts`).

2. **GraphQL SDL & Express:**
   * Apollo Server v4 acoplado ao Express via `expressMiddleware`.
   * Paginação genérica via *wrappers* GraphQL (`MetaPaginacao`, `PaginaPessoas`).
   * Validação rigorosa de *inputs* e tipagem forte nos schemas.

---

## 🧪 Como Testar o MVP

### 1. Subir a Infraestrutura Local
```bash
# Instalar dependências
npm install
---
# Subir banco de dados PostgreSQL via Docker
docker-compose up -d
---
# Executar as migrações/push do schema Prisma
npx prisma db push
---
## 🏗️ Estrutura de Pastas

```

src/
├── @types/                     # Declarações e extensões globais de tipos do TypeScript
├── config/                     # Variáveis de ambiente e constantes da aplicação (env.ts)
│
├── domain/                     # 🟢 CAMADA DE DOMÍNIO (Regras de Negócio Puras)
│   ├── entities/               # Entidades de negócio (ex: Pessoa.ts, Serie.ts)
│   ├── errors/                 # Erros de domínio customizados (ex: InvalidCargaError.ts)
│   └── repositories/           # [DIP] Interfaces/Contratos dos Repositórios (IPessoaRepository.ts)
│
├── application/                # 🟡 CAMADA DE APLICAÇÃO (Casos de Uso)
│   ├── dtos/                   # Schemas/Tipos de dados de entrada e saída (Inputs/Outputs)
│   └── use-cases/              # Lógica da aplicação orquestrada por caso de uso
│       ├── pessoa/             # Ex: CriarPessoaUseCase.ts, ObterMetabolismoUseCase.ts
│       ├── treino/             # Ex: IniciarSessaoTreinoUseCase.ts
│       └── exercicio/          # Ex: CadastrarExercicioUseCase.ts
│
├── infrastructure/             # 🔴 CAMADA DE INFRAESTRUTURA (Detalhes e Tecnologias Externas)
│   ├── database/               # Conexão com o banco, instância do Prisma, Migrations
│   │   └── prisma/             # Instância do PrismaClient e helpers do ORM
│   ├── repositories/           # Implementação concreta dos contratos do domínio via Prisma
│   │   ├── PrismaPessoaRepository.ts
│   │   └── PrismaSerieRepository.ts
│   └── services/               # Serviços de terceiros (Loggers, envio de email, APIs externas)
│
├── presentation/               # 🔵 CAMADA DE APRESENTAÇÃO (Ponto de Entrada da API)
│   ├── graphql/                # Apollo Server & GraphQL
│   │   ├── type-defs/          # Schemas do GraphQL (pessoa.graphql, treino.graphql)
│   │   ├── resolvers/          # Resolvers HTTP/GraphQL (Apenas delegam para os Use Cases)
│   │   └── context.ts          # Contexto do Apollo (Sessão, Injeção de repositórios)
│   ├── http/                   # Controllers e Rotas Express (se houver REST/Healthcheck)
│   └── middlewares/            # Middlewares Express/GraphQL (Autenticação, Error Handling)
│
├── main/                       # ⚪ COMPOSITION ROOT (Injeção de Dependência e Bootstrap)
│   ├── factories/              # Instanciação e montagem dos UseCases com seus Repositórios
│   └── server.ts               # Subida do servidor Express + Apollo Server
│
└── index.ts                    # Entrypoint de execução



---

## 📌 Visão Geral do Projeto

Este repositório abriga a API backend desenvolvida em **Node.js (TypeScript)** com **Express** e **Apollo Server (GraphQL)**, persistida em **PostgreSQL** através do **Prisma ORM**, e containerizada com **Docker**.

O objetivo do sistema é substituir planilhas estáticas por um acompanhamento dinâmico de séries, cargas e volumes para treinos de calistenia/musculação, permitindo mensurar a progressão real de força em relação ao ganho de massa.

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
| :--- | :--- |
| **Runtime & Linguagem** | Node.js (v20+) / TypeScript |
| **Framework Web & API** | Express.js / Apollo Server 4 (GraphQL) |
| **Banco de Dados & ORM** | PostgreSQL 16 / Prisma ORM |
| **Containerização** | Docker / Docker Compose |
| **Tooling & Dev** | `ts-node`, `nodemon`, DBeaver |


---

## 🗄️ Modelagem de Dados (Prisma Schema)

O esquema do banco reflete o relacionamento relacional entre usuários (`Pessoa`), catálogo de exercícios (`Exercicio`), sessões executadas (`SessaoTreino`) e as séries individuais (`Series`). 

Utilizamos `@map` e `@@map` para preservar o padrão `snake_case` no banco físico mantendo a convenção `camelCase` no ecossistema TypeScript:

<details open>
<summary><b>Clique para ver o arquivo <code>prisma/schema.prisma</code></b></summary>

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Pessoa {
  id                  Int            @id @default(autoincrement())
  peso                Decimal?       @db.Decimal(5, 2)
  altura              Decimal?       @db.Decimal(3, 2)
  taxaMetabolicaBasal Decimal?       @map("taxa_metabolica_basal") @db.Decimal(6, 2)
  sessoesTreino       SessaoTreino[]

  @@map("pessoa")
}

model Exercicio {
  idExercicio   Int      @id @default(autoincrement()) @map("id_exercicio")
  nomeExercicio String   @map("nome_exercicio") @db.VarChar(100)
  grupoMuscular String?  @map("grupo_muscular") @db.VarChar(50)
  permiteCarga  Boolean  @default(true) @map("permite_carga")
  series        Series[]

  @@map("exercicio")
}

model SessaoTreino {
  idSessao        Int       @id @default(autoincrement()) @map("id_sessao")
  idPessoa        Int       @map("id_pessoa")
  dataHoraInicio  DateTime  @map("data_hora_inicio") @db.Timestamp()
  dataHoraFim     DateTime? @map("data_hora_fim") @db.Timestamp()
  observacoes     String?   @db.Text

  // Relacionamentos
  pessoa Pessoa   @relation(fields: [idPessoa], references: [id], onDelete: Cascade)
  series Series[]

  @@map("sessao_treino")
}

model Series {
  idSerie        Int      @id @default(autoincrement()) @map("id_serie")
  idSessao       Int      @map("id_sessao")
  idExercicio    Int      @map("id_exercicio")
  numeroSerie    Int      @map("numero_serie")
  repsRealizadas Int?     @map("reps_realizadas")
  cargaAdicional Decimal? @map("carga_adicional") @db.Decimal(5, 2)
  concluido      Boolean? @default(false)

  // Relacionamentos
  sessao    SessaoTreino @relation(fields: [idSessao], references: [idSessao], onDelete: Cascade)
  exercicio Exercicio    @relation(fields: [idExercicio], references: [idExercicio], onDelete: Restrict)

  @@map("series")
}


</details>

---

## 🗺️ Roteiro de Desenvolvimento (10 Fases)

---

### 🔹 Fase 1: Modelagem Conceitual & Regras de Negócio
- [x] Definição dos requisitos funcionais (checklist de treino, registro de carga, volume).
- [x] Criação do Modelo Entidade-Relacionamento (MER) em notação de Peter Chen (brModelo).
- [x] Mapeamento das entidades principais: `Pessoa`, `Exercicio`, `SessaoTreino` e `Serie`.
- [x] Validação das cardinalidades ($1:1$, $1:N$, $0:N$) para garantir histórico dinâmico.

---

### 🔹 Fase 2: Modelagem Lógica e Estruturação SQL
- [x] Conversão do MER para o Modelo Relacional (Diagrama EER).
- [x] Criação dos scripts DDL (`CREATE TABLE`) com chave primária auto-incremental (`IDENTITY`).
- [x] Configuração de chaves estrangeiras com restrições (`ON DELETE CASCADE` / `RESTRICT`).
- [x] Testes de inserção e integridade referencial via DBeaver.

---

### 🔹 Fase 3: Infraestrutura Docker & Ambiente de Banco
- [x] Criação do `Dockerfile` multi-stage build otimizado com Node.js Alpine.
- [x] Configuração do `docker-compose.yml` para os serviços de API e PostgreSQL.
- [x] Criação dos arquivos `.dockerignore` e `.env` para gestão de variáveis sensíveis.
- [x] Configuração do *healthcheck* para garantir que a API só conecte ao banco pronto.

---

### 🔹 Fase 4: Setup do Projeto Node.js & TypeScript
- [x] Inicialização do repositório (`npm init -y`) e controle de versão (`.gitignore`).
- [x] Instalação do TypeScript, `ts-node`, `nodemon` e tipagens (`@types/*`).
- [x] Ajuste fino do `tsconfig.json` para compilação estrita em `CommonJS/ES2022`.
- [x] Criação dos scripts de desenvolvimento (`npm run dev`) e build de produção (`npm run build`).

---

### 🔹 Fase 5: Mapeamento ORM com Prisma
- [x] Inicialização do Prisma no projeto (`npx prisma init`).
- [x] Mapeamento do `schema.prisma` espelhando as tabelas em `snake_case` com atalhos `@map`.
- [x] Conexão e sincronização do schema com a base nativa (`npx prisma db pull` ou `npx prisma migrate dev`).
- [ ] Instanciação singleton do `PrismaClient` na aplicação.

---

### 🔹 Fase 6: Arquitetura GraphQL & Servidor Express
- [ ] Integração do Apollo Server v4 com middlewares do Express (`expressMiddleware`).
- [ ] Estruturação das pastas do projeto (`/graphql`, `/resolvers`, `/typeDefs`, `/services`).
- [ ] Definição dos Tipos Base no Schema GraphQL (`Pessoa`, `Exercicio`, `SessaoTreino`, `Serie`).
- [ ] Configuração de tratamento global de erros no GraphQL.

---

### 🔹 Fase 7: Implementação das Mutações & Queries (CRUD)
- [ ] **Queries:** Consulta de catálogo de exercícios, histórico de sessões por pessoa e resumo por data.
- [ ] **Mutations:** Cadastro de usuário, criação de sessão de treino e inserção de séries concluídas.
- [ ] Validação de entradas (inputs sanitizados) e checagem de tipos GraphQL.
- [ ] Testes de execução das operações via Apollo Sandbox (`http://localhost:4000/graphql`).

---

### 🔹 Fase 8: Regras de Negócio Avançadas & Métricas
- [ ] Implementação do cálculo automático do **Volume Total de Carga** ($\text{Séries} \times \text{Reps} \times \text{Carga}$).
- [ ] Algoritmo de linha de tendência para diferenciar hipertrofia real de *pump* temporário.
- [ ] Endpoint/Resolver para cálculo ajustado de gasto calórico/metabólico.
- [ ] Lógica para acompanhamento de progressão no treino de rua/calistenia.

---

### 🔹 Fase 9: Testes Automatizados & Qualidade de Código
- [ ] Configuração do ambiente de testes (Jest / Supertest).
- [ ] Escrita de testes unitários para a lógica de cálculo de volume e regras de negócio.
- [ ] Testes de integração para as rotas GraphQL e banco de dados isolado em container de testes.
- [ ] Padronização de código com ESLint e Prettier.

---

### 🔹 Fase 10: Concepção do Projeto, CI/CD & Deploy
- [ ] Configuração de pipelines de integração contínua (GitHub Actions).
- [ ] Geração da imagem final de produção via Docker Hub ou Container Registry.
- [ ] Deploy do banco PostgreSQL e da API Express/GraphQL em ambiente Cloud.
- [ ] Monitoramento, logs de execução e encerramento do primeiro ciclo de release.

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
* **Docker** e **Docker Compose** instalados.
* **Node.js** (v20 ou superior) instalado localmente.

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/silascunha97/API_Para_treinos.git
   cd API_Para_treinos
   ```
