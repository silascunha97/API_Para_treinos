# 🏋️ Workout Tracker API

> **API backend para gerenciamento, acompanhamento e análise da evolução de treinos.**

O **Workout Tracker API** é um projeto backend desenvolvido para substituir planilhas estáticas por uma plataforma estruturada para registro de **sessões de treino, exercícios, séries, repetições e cargas**.

O projeto foi concebido com foco em **separação de responsabilidades, modelagem de domínio e escalabilidade**, utilizando **Clean Architecture**, conceitos de **Domain-Driven Design (DDD)** e uma API baseada em **GraphQL**.

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
* [ ] Testes automatizados;
* [ ] Métricas avançadas;
* [ ] Pipeline CI/CD;
* [ ] Deploy em ambiente Cloud.

---

## 🧠 Arquitetura

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
* detalhes de infraestrutura.

Dessa forma, os **Use Cases** podem depender de contratos definidos pelo domínio, enquanto a infraestrutura fornece as implementações concretas.

---

## 📂 Estrutura

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

## 🧩 Domínio

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

## 🗄️ Persistência

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

---

## 🛠️ Stack

| Categoria       | Tecnologia            |
| --------------- | --------------------- |
| Runtime         | Node.js 20+           |
| Linguagem       | TypeScript            |
| API             | GraphQL               |
| GraphQL Server  | Apollo Server 4       |
| HTTP            | Express.js            |
| Banco de dados  | PostgreSQL 16         |
| ORM             | Prisma                |
| Containerização | Docker                |
| Orquestração    | Docker Compose        |
| Desenvolvimento | `ts-node` / `nodemon` |
| Database GUI    | DBeaver               |

---

## 🐳 Ambiente de Desenvolvimento

O PostgreSQL é executado através de Docker, permitindo reproduzir o ambiente de desenvolvimento sem depender de uma instalação local do banco.

### Pré-requisitos

* Node.js `20+`;
* npm;
* Docker;
* Docker Compose.

### Clone

```bash
git clone https://github.com/silascunha97/API_Para_treinos.git

cd API_Para_treinos
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/workout_tracker"
```

> Ajuste a URL conforme a configuração utilizada no `docker-compose.yml`.

### Suba a infraestrutura

```bash
docker-compose up -d
```

Verifique os containers:

```bash
docker-compose ps
```

### Sincronize o schema

```bash
npx prisma db push
```

### Execute a aplicação

```bash
npm run dev
```

---

## 📊 Modelo de Dados

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

---

## 📐 Decisões Arquiteturais

### Repository Pattern

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

Isso reduz o acoplamento entre os casos de uso e o mecanismo de persistência.

### Use Cases

As operações da aplicação são organizadas em casos de uso, evitando concentrar regras de negócio diretamente nos resolvers.

Exemplos planejados:

```text
CriarPessoaUseCase
ObterMetabolismoUseCase
IniciarSessaoTreinoUseCase
CadastrarExercicioUseCase
```

### GraphQL

O GraphQL será utilizado como camada de apresentação da API, permitindo estruturar queries e mutations de acordo com as necessidades do cliente.

O endpoint planejado para desenvolvimento é:

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
* [x] Prisma Schema.

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
* [x] Implementação completa dos Use Cases;
* [x] Implementação dos resolvers.

## 05 — GraphQL

* [x] Apollo Server;
* [x] TypeDefs;
* [x] Queries;
* [x] Mutations;
* [x] Validação de inputs;
* [x] Tratamento global de erros.

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

O projeto está sendo desenvolvido de maneira incremental, partindo da modelagem do domínio e infraestrutura para posteriormente avançar para regras de negócio, API GraphQL, testes automatizados e CI/CD.

### Progresso atual

```text
Modelagem              ████████████████████ 100%
Infraestrutura         ████████████████████ 100%
Node.js + TypeScript   ████████████████████ 100%
Prisma                 ███████████████████░  90%
GraphQL                █████░░░░░░░░░░░░░░░  25%
CRUD                   ░░░░░░░░░░░░░░░░░░░░   0%
Métricas               ░░░░░░░░░░░░░░░░░░░░   0%
Testes                 ░░░░░░░░░░░░░░░░░░░░   0%
CI/CD                  ░░░░░░░░░░░░░░░░░░░░   0%
```

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
Use Cases
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

## 📄 Licença

O projeto está atualmente em desenvolvimento e ainda não possui uma licença pública definida.

---

<div align="center">

**Workout Tracker API**

Backend desenvolvido com TypeScript, GraphQL, Prisma e PostgreSQL.

</div>

### O que eu mudaria em relação ao README anterior

Para **portfólio**, eu evitaria vender o projeto simplesmente como "API de treinos". O ponto mais interessante para um recrutador técnico é a **engenharia por trás dele**: você está usando o domínio de treino como problema para demonstrar modelagem, arquitetura, persistência, API e posteriormente CI/CD.

Também fiz uma escolha importante: **não coloquei badges falsos de build, coverage, versão ou deploy**. Eles ficam ótimos em README, mas só devem entrar quando essas coisas realmente existirem.

Quando o projeto avançar, eu adicionaria no topo algo como:

```text
[Node.js] [TypeScript] [GraphQL] [PostgreSQL] [Prisma] [Docker] [CI]
```

e, depois que houver implementação real:

```text
Build     ✓
Tests     ✓
Coverage  87%
CI        ✓
Docker    ✓
Deploy    ✓
```

Isso deixa o README muito mais convincente porque o candidato não está apenas **afirmando** que conhece determinada tecnologia — o próprio repositório passa a servir como evidência.
