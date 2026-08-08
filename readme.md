# 🏋️ Workout Tracker API

> **API backend para gerenciamento, acompanhamento e análise da evolução de treinos.**

O **Workout Tracker API** é um projeto backend desenvolvido para substituir planilhas estáticas por uma plataforma estruturada para registro de **sessões de treino, exercícios, séries, repetições e cargas**.

O projeto foi concebido como um laboratório prático de engenharia de software, com foco em **separação de responsabilidades, modelagem de domínio, arquitetura de software, persistência e construção de APIs**, utilizando **Clean Architecture**, conceitos de **Domain-Driven Design (DDD)** e uma API baseada em **GraphQL**.

Além das funcionalidades relacionadas ao domínio de treinos, o projeto possui um subsistema de **autenticação e autorização baseado em JWT, Bearer Token e Refresh Token Rotation**, mantendo os mecanismos de infraestrutura desacoplados das regras de negócio.

---

## 🎯 Objetivo

O projeto nasceu de um problema simples: planilhas conseguem armazenar dados de treino, mas dificultam a evolução para análises mais inteligentes.

A proposta é transformar o histórico de treino em dados estruturados que possam posteriormente ser utilizados para acompanhar:

* 📈 Progressão de carga;
* 💪 Evolução de força;
* 🔢 Volume semanal;
* 🏋️ Histórico de exercícios;
* ⏱️ Sessões de treinamento;
* 📊 Métricas de desempenho;
* 🔥 Indicadores relacionados ao gasto metabólico.

A arquitetura foi pensada para permitir que novas regras de negócio e métricas sejam adicionadas sem acoplar o domínio às tecnologias utilizadas na infraestrutura.

---

## ✨ Principais Características

* [x] Modelagem conceitual do domínio;
* [x] Modelo Entidade-Relacionamento (MER);
* [x] Modelo relacional;
* [x] PostgreSQL containerizado;
* [x] Prisma ORM;
* [x] TypeScript;
* [x] Estrutura baseada em Clean Architecture;
* [x] Separação entre domínio, aplicação e infraestrutura;
* [x] Contratos de repositórios;
* [x] Queries GraphQL;
* [x] Mutations GraphQL;
* [x] Autenticação JWT;
* [x] Bearer Token;
* [x] Refresh Token Rotation;
* [x] Hashing de senhas;
* [x] Proteção de resolvers GraphQL;
* [ ] Testes automatizados;
* [ ] Métricas avançadas;
* [ ] Pipeline CI/CD;
* [ ] Deploy em ambiente Cloud.

---

# 🧠 Arquitetura

A aplicação utiliza uma organização inspirada em **Clean Architecture**, buscando manter as regras de negócio independentes de frameworks e detalhes de infraestrutura.

```text
┌─────────────────────────────────────────────────────┐
│                    Presentation                      │
│            GraphQL / Express / Middleware            │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                    Application                       │
│                DTOs / Use Cases                      │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                       Domain                         │
│        Entities / Errors / Repository Contracts     │
└──────────────────────────┬──────────────────────────┘
                           ▲
                           │
┌──────────────────────────┴──────────────────────────┐
│                   Infrastructure                     │
│             Prisma / PostgreSQL / Services          │
└─────────────────────────────────────────────────────┘
```

### Por que essa separação?

A principal preocupação arquitetural é evitar que regras de negócio dependam diretamente de:

* Prisma;
* PostgreSQL;
* Express;
* Apollo Server;
* bibliotecas de autenticação;
* detalhes de infraestrutura.

Dessa forma, os **Use Cases** dependem de contratos definidos pelo domínio, enquanto a infraestrutura fornece as implementações concretas.

Esse princípio também é aplicado ao subsistema de autenticação. Bibliotecas como `bcrypt` e `jsonwebtoken` não são utilizadas diretamente pelos casos de uso; elas são encapsuladas por abstrações e adapters específicos.

---

# 🔐 Autenticação e Autorização

O sistema possui um subsistema de autenticação e autorização **stateless** baseado em **JWT (JSON Web Token)**, utilizando o padrão **Bearer Token** para autenticação das requisições.

A gestão das sessões utiliza **Refresh Token Rotation**, com os tokens de renovação persistidos no PostgreSQL e associados ao usuário autenticado.

## Estratégia de autenticação

```text
┌──────────────┐
│    Cliente   │
└──────┬───────┘
       │
       │ e-mail + senha
       ▼
┌──────────────────────────┐
│ AutenticarComSenhaUseCase│
└────────────┬─────────────┘
             │
             ├── Hash / comparação
             │   de senha
             ▼
       ┌──────────────┐
       │   PostgreSQL │
       └──────────────┘
             │
             │ Tokens
             ▼
┌──────────────────────────┐
│       AuthPayload        │
│                          │
│ Access Token   → 15 min  │
│ Refresh Token  → 7 dias  │
└──────────────────────────┘
```

## Componentes

### Domínio

A camada de domínio define contratos para evitar que as regras de negócio dependam diretamente das bibliotecas utilizadas na infraestrutura.

* `IPasswordHasher` — abstração para hashing e comparação de senhas;
* `ITokenProvider` — abstração para geração e validação de tokens;
* `IUsuarioRepository` — contrato para persistência de usuários;
* `IRefreshTokenRepository` — contrato para gerenciamento dos Refresh Tokens.

### Infraestrutura

As implementações concretas ficam isoladas na camada de infraestrutura:

* `BcryptAdapter` — hashing e comparação assíncrona de senhas;
* `JwtAdapter` — geração e validação dos tokens JWT;
* `PrismaUsuarioRepository` — persistência de usuários através do Prisma;
* `PrismaRefreshTokenRepository` — persistência e controle dos Refresh Tokens.

Essa abordagem mantém as regras de negócio desacopladas de `bcrypt`, `jsonwebtoken` e Prisma.

### Application

A autenticação é organizada através de casos de uso:

* `CriarContaUseCase` — criação de usuário, hashing da senha e emissão inicial dos tokens;
* `AutenticarComSenhaUseCase` — autenticação por e-mail e senha e rotação dos Refresh Tokens.

### Presentation / GraphQL

A camada GraphQL é responsável pela integração da autenticação com a API:

* `AuthPayload` para retorno dos tokens;
* Inputs específicos para autenticação;
* `buildGraphQLContext` para extração do cabeçalho `Authorization`;
* suporte ao padrão `Authorization: Bearer <token>`;
* `requireAuth` para proteção de resolvers que exigem autenticação;
* factories para composição dos casos de uso de autenticação.

## Refresh Token Rotation

Os Refresh Tokens possuem ciclo de vida controlado e são persistidos no PostgreSQL.

O fluxo atual permite:

1. emitir um Refresh Token durante a autenticação;
2. associá-lo à sessão do usuário;
3. controlar sua expiração;
4. revogar o token utilizado;
5. emitir um novo Refresh Token durante a renovação da sessão.

```text
Refresh Token atual
        │
        ▼
┌───────────────────┐
│ Validação         │
│ Expiração         │
│ Revogação         │
└─────────┬─────────┘
          │
          ▼
   Token revogado
          │
          ├──────────────► Novo Access Token
          │
          └──────────────► Novo Refresh Token
```

## Parâmetros atuais

| Componente              | Estratégia   |
| ----------------------- | ------------ |
| Access Token            | JWT / Bearer |
| Expiração Access Token  | `15 minutos` |
| Refresh Token           | Rotacionável |
| Expiração Refresh Token | `7 dias`     |
| Persistência            | PostgreSQL   |
| ORM                     | Prisma       |
| Hash de senha           | Bcrypt       |
| API                     | GraphQL      |

A autenticação foi implementada como uma preocupação independente das regras específicas do domínio, permitindo que mecanismos de hashing, emissão de tokens ou persistência sejam substituídos sem alterar os casos de uso.

---

# 📂 Estrutura

```text
src/
│
├── @types/
├── config/
│
├── domain/
│   ├── entities/
│   ├── errors/
│   └── repositories/
│
├── application/
│   ├── dtos/
│   └── use-cases/
│       ├── auth/
│       ├── pessoa/
│       ├── treino/
│       └── exercicio/
│
├── infrastructure/
│   ├── database/
│   │   └── prisma/
│   ├── repositories/
│   └── services/
│
├── presentation/
│   ├── graphql/
│   │   ├── type-defs/
│   │   ├── resolvers/
│   │   └── context.ts
│   ├── http/
│   └── middlewares/
│
├── main/
│   ├── factories/
│   └── server.ts
│
└── index.ts
```

### Responsabilidade das camadas

| Camada           | Responsabilidade                           |
| ---------------- | ------------------------------------------ |
| `domain`         | Regras de negócio, entidades e contratos   |
| `application`    | Casos de uso e DTOs                        |
| `infrastructure` | Persistência e serviços externos           |
| `presentation`   | GraphQL, HTTP e middleware                 |
| `main`           | Composição de dependências e inicialização |

---

# 🧩 Domínio

O domínio atual é composto por quatro conceitos principais:

```text
Pessoa
   │
   │ 1:N
   ▼
SessaoTreino
   │
   │ 1:N
   ▼
Series
   │
   │ N:1
   ▼
Exercicio
```

### 👤 Pessoa

Representa o usuário/atleta e mantém informações físicas utilizadas pelo sistema.

Principais dados:

* `peso`;
* `altura`;
* `taxaMetabolicaBasal`.

### 🏋️ Exercicio

Representa o catálogo de exercícios disponíveis.

Principais dados:

* `nomeExercicio`;
* `grupoMuscular`;
* `permiteCarga`.

### ⏱️ SessaoTreino

Representa uma sessão de treinamento realizada por uma pessoa.

Principais dados:

* `dataHoraInicio`;
* `dataHoraFim`;
* `observacoes`.

### 🔢 Series

Representa a execução individual de um exercício dentro de uma sessão.

Principais dados:

* `numeroSerie`;
* `repsRealizadas`;
* `cargaAdicional`;
* `concluido`.

---

# 🗄️ Persistência

A persistência utiliza **PostgreSQL + Prisma ORM**.

O projeto utiliza `@map` e `@@map` para manter uma separação entre a convenção utilizada no código e a convenção utilizada no banco:

```text
TypeScript
camelCase
    │
    ▼
Prisma @map / @@map
    │
    ▼
PostgreSQL
snake_case
```

Exemplo:

```prisma
taxaMetabolicaBasal Decimal?
  @map("taxa_metabolica_basal")
```

Isso permite manter a legibilidade e convenções do TypeScript sem abrir mão de uma convenção consistente no banco de dados.

A persistência também é utilizada pelo subsistema de autenticação para armazenar usuários e Refresh Tokens.

---

# 🛠️ Stack

| Categoria       | Tecnologia            |
| --------------- | --------------------- |
| Runtime         | Node.js 20+           |
| Linguagem       | TypeScript            |
| API             | GraphQL               |
| GraphQL Server  | Apollo Server 4       |
| HTTP            | Express.js            |
| Banco de dados  | PostgreSQL 16         |
| ORM             | Prisma                |
| Autenticação    | JWT / Bearer Token    |
| Hash de senha   | Bcrypt                |
| Containerização | Docker                |
| Orquestração    | Docker Compose        |
| Desenvolvimento | `ts-node` / `nodemon` |
| Database GUI    | DBeaver               |

---

# 🐳 Ambiente de Desenvolvimento

O PostgreSQL é executado através de Docker, permitindo reproduzir o ambiente de desenvolvimento sem depender de uma instalação local do banco.

## Pré-requisitos

* Node.js `20+`;
* npm;
* Docker;
* Docker Compose.

## Clone

```bash
git clone https://github.com/silascunha97/API_Para_treinos.git

cd API_Para_treinos
```

## Instale as dependências

```bash
npm install
```

## Configure as variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/workout_tracker"
```

> Ajuste a URL conforme a configuração utilizada no `docker-compose.yml`.

## Suba a infraestrutura

```bash
docker-compose up -d
```

Verifique os containers:

```bash
docker-compose ps
```

## Sincronize o schema

```bash
npx prisma db push
```

## Execute a aplicação

```bash
npm run dev
```

---

# 🔑 Testando a Autenticação

Após iniciar a aplicação e sincronizar o banco de dados, as mutations GraphQL relacionadas à autenticação podem ser utilizadas para testar o fluxo de criação de conta e login.

### Fluxo conceitual

```text
Criar conta
    │
    ▼
Hash da senha
    │
    ▼
Persistência do usuário
    │
    ▼
Emissão de tokens
    │
    ├── Access Token
    │
    └── Refresh Token
             │
             ▼
       Persistência
             │
             ▼
     Renovação da sessão
             │
             ▼
     Rotação do token
```

O acesso a operações protegidas deve utilizar o cabeçalho:

```http
Authorization: Bearer <access_token>
```

---

# 📊 Modelo de Dados

A estrutura atual do banco pode ser resumida da seguinte maneira:

```text
┌──────────────┐
│    Pessoa    │
├──────────────┤
│ id           │
│ peso         │
│ altura       │
│ taxaMetab... │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────────┐
│   SessaoTreino   │
├──────────────────┤
│ idSessao         │
│ idPessoa         │
│ dataHoraInicio   │
│ dataHoraFim      │
│ observacoes      │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐       N:1       ┌────────────────┐
│      Series      │─────────────────│    Exercicio   │
├──────────────────┤                 ├────────────────┤
│ idSerie          │                 │ idExercicio    │
│ idSessao         │                 │ nomeExercicio  │
│ idExercicio      │                 │ grupoMuscular  │
│ numeroSerie      │                 │ permiteCarga   │
│ repsRealizadas   │                 └────────────────┘
│ cargaAdicional   │
│ concluido        │
└──────────────────┘
```

A camada de autenticação adiciona ainda entidades relacionadas à identidade e gerenciamento de sessão:

```text
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────────┐
│   RefreshToken   │
├──────────────────┤
│ id               │
│ usuarioId        │
│ expiraEm         │
│ revogado         │
└──────────────────┘
```

---

# 📐 Decisões Arquiteturais

## Repository Pattern

O domínio define contratos para os repositórios, enquanto a infraestrutura fornece as implementações.

```text
Domain
   │
   └── IPessoaRepository
             ▲
             │ implements
             │
Infrastructure
   │
   └── PrismaPessoaRepository
```

O mesmo princípio é aplicado aos mecanismos relacionados à autenticação:

```text
Domain
   │
   ├── IUsuarioRepository
   ├── IRefreshTokenRepository
   ├── IPasswordHasher
   └── ITokenProvider
             ▲
             │ implements
             │
Infrastructure
   │
   ├── PrismaUsuarioRepository
   ├── PrismaRefreshTokenRepository
   ├── BcryptAdapter
   └── JwtAdapter
```

Isso reduz o acoplamento entre os casos de uso e os mecanismos concretos de persistência e segurança.

---

## Use Cases

As operações da aplicação são organizadas em casos de uso, evitando concentrar regras de negócio diretamente nos resolvers.

Exemplos:

```text
CriarPessoaUseCase
ObterMetabolismoUseCase
IniciarSessaoTreinoUseCase
CadastrarExercicioUseCase

CriarContaUseCase
AutenticarComSenhaUseCase
```

---

## GraphQL

O GraphQL é utilizado como camada de apresentação da API, permitindo estruturar queries e mutations de acordo com as necessidades do cliente.

A autenticação é integrada ao contexto GraphQL, permitindo que resolvers protegidos verifiquem a identidade do usuário através do Access Token.

O endpoint de desenvolvimento é:

```text
http://localhost:4000/graphql
```

---

# 📈 Roadmap

## 01 — Modelagem

* [x] Requisitos funcionais;
* [x] Modelo Entidade-Relacionamento;
* [x] Modelo relacional;
* [x] Cardinalidades;
* [x] Definição das entidades.

## 02 — Banco de Dados

* [x] PostgreSQL;
* [x] DDL;
* [x] Chaves primárias;
* [x] Chaves estrangeiras;
* [x] Integridade referencial;
* [x] Prisma Schema;
* [x] Modelagem de usuários;
* [x] Persistência de Refresh Tokens.

## 03 — Infraestrutura

* [x] Dockerfile;
* [x] Docker Compose;
* [x] PostgreSQL containerizado;
* [x] `.dockerignore`;
* [x] Variáveis de ambiente;
* [x] Healthcheck.

## 04 — Backend

* [x] Node.js;
* [x] TypeScript;
* [x] Configuração do projeto;
* [x] Estrutura arquitetural;
* [x] Implementação dos Use Cases;
* [x] Implementação dos resolvers;
* [x] Abstrações de autenticação;
* [x] JWT;
* [x] Bearer Token;
* [x] Refresh Token Rotation.

## 05 — GraphQL

* [x] Apollo Server;
* [x] TypeDefs;
* [x] Queries;
* [x] Mutations;
* [x] Validação de inputs;
* [x] Tratamento global de erros;
* [x] Contexto de autenticação;
* [x] Proteção de resolvers.

## 06 — Métricas

* [x] Volume total de carga;
* [x] Progressão de força;
* [x] Histórico de desempenho;
* [x] Indicadores metabólicos;
* [x] Análise de progressão.

### Fórmula inicial

```text
Volume Total = Séries × Repetições × Carga
```

## 07 — Qualidade

* [ ] Jest;
* [ ] Supertest;
* [ ] Testes unitários;
* [ ] Testes de integração;
* [ ] ESLint;
* [ ] Prettier.

## 08 — DevOps

* [ ] GitHub Actions;
* [ ] CI;
* [ ] Build de imagem de produção;
* [ ] Container Registry;
* [ ] Deploy;
* [ ] Monitoramento;
* [ ] Logs.

---

# 🧪 Testes

A estratégia de testes planejada contempla diferentes níveis:

```text
                  ┌───────────────────┐
                  │ Integration Tests │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │   GraphQL / API   │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │    Use Cases      │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │  Domain / Rules   │
                  └───────────────────┘
```

A cobertura será expandida conforme as funcionalidades do MVP forem implementadas.

---

# 🚧 Status

**Em desenvolvimento — MVP**

O projeto está sendo desenvolvido de maneira incremental, partindo da modelagem do domínio e infraestrutura e avançando progressivamente para regras de negócio, autenticação, API GraphQL, testes automatizados e CI/CD.

### Progresso atual

```text
Modelagem              ████████████████████ 100%
Infraestrutura         ████████████████████ 100%
Node.js + TypeScript   ████████████████████ 100%
Prisma                 ███████████████████░  90%
Autenticação           ████████████████████ 100%
GraphQL                █████████████████░░░  85%
CRUD                   █████░░░░░░░░░░░░░░░  25%
Métricas               ████████████████████ 100%
Testes                 ░░░░░░░░░░░░░░░░░░░░   0%
CI/CD                  ░░░░░░░░░░░░░░░░░░░░   0%
```

> Os percentuais representam o estágio atual de desenvolvimento do projeto e não métricas automatizadas de cobertura ou qualidade.

---

# 🎓 Objetivos Técnicos

Este projeto também funciona como laboratório prático para aprofundar conhecimentos em:

* Arquitetura de software;
* Clean Architecture;
* Domain-Driven Design;
* Modelagem de dados;
* PostgreSQL;
* Prisma ORM;
* GraphQL;
* TypeScript;
* Autenticação e autorização;
* JWT;
* Refresh Token Rotation;
* Docker;
* Testes automatizados;
* CI/CD;
* DevOps.

---

# 🔭 Próximos Passos

A evolução planejada segue esta ordem:

```text
Modelagem
    ↓
Persistência
    ↓
Arquitetura
    ↓
Use Cases
    ↓
Autenticação
    ↓
GraphQL
    ↓
CRUD
    ↓
Regras de negócio
    ↓
Métricas
    ↓
Testes
    ↓
CI/CD
    ↓
Deploy
```

---

# 📄 Licença

O projeto está atualmente em desenvolvimento e ainda não possui uma licença pública definida.

---

<div align="center">

**Workout Tracker API**

Backend desenvolvido com TypeScript, GraphQL, Prisma e PostgreSQL.

</div>
