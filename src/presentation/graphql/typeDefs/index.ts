export const typeDefs = `#graphql

  input AutenticarGoogleInput {
  idToken: String!
  }

  type Mutation {
    registrar(input: RegistrarInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    autenticarComGoogle(input: AutenticarGoogleInput!): AuthPayload!
  }


  # --- AUTENTICAÇÃO E USUÁRIO ---
  type Usuario {
    id: ID!
    nome: String!
    email: String!
    idPessoa: ID
  }

  type AuthPayload {
    usuario: Usuario!
    accessToken: String!
    refreshToken: String!
  }

  input RegistrarInput {
    nome: String!
    email: String!
    senha: String!
    idPessoa: Int
  }

  input LoginInput {
    email: String!
    senha: String!
  }

  # --- QUERIES EXISTENTES ---
  type Query {
    healthCheck: String!
    # ... demais queries
  }

  # --- MUTATIONS ---
  type Mutation {
    # Autenticação
    registrar(input: RegistrarInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # ... demais mutations
  }

  # --- METADADOS E PAGINAÇÃO ---
  type MetaPaginacao {
    totalRegistros: Int!
    paginaAtual: Int!
    limitePorPagina: Int!
    totalPaginas: Int!
    temProximaPagina: Boolean!
    temPaginaAnterior: Boolean!
  }

  # --- ENTIDADES BASE ---
  type Pessoa {
    id: ID!
    peso: Float
    altura: Float
    taxaMetabolicaBasal: Float
  }

  type Exercicio {
    idExercicio: ID!
    nomeExercicio: String!
    grupoMuscular: String
    permiteCarga: Boolean!
  }

  type SessaoTreino {
    idSessao: ID!
    idPessoa: ID!
    dataHoraInicio: String!
    dataHoraFim: String
    observacoes: String
  }

  type Serie {
    idSerie: ID!
    idSessao: ID!
    idExercicio: ID!
    numeroSerie: Int!
    repsRealizadas: Int
    cargaAdicional: Float
    concluido: Boolean
  }

  # --- TIPOS PAGINADOS (WRAPPERS) ---
  type PaginaPessoas {
    dados: [Pessoa!]!
    meta: MetaPaginacao!
  }

  type PaginaExercicios {
    dados: [Exercicio!]!
    meta: MetaPaginacao!
  }

  # --- INPUTS (DTOs) ---
  input CreatePessoaInput {
    peso: Float
    altura: Float
    taxaMetabolicaBasal: Float
  }

  input UpdatePessoaInput {
    id: ID!
    peso: Float
    altura: Float
    taxaMetabolicaBasal: Float
  }

  input CreateExercicioInput {
    nomeExercicio: String!
    grupoMuscular: String
    permiteCarga: Boolean
  }

  input IniciarSessaoTreinoInput {
    idPessoa: ID!
    observacoes: String
  }

  input FinalizarSessaoTreinoInput {
    idSessao: ID!
    observacoes: String
  }

  input RegistrarSerieInput {
    idSessao: ID!
    idExercicio: ID!
    numeroSerie: Int!
    repsRealizadas: Int
    cargaAdicional: Float
    concluido: Boolean
  }

  # --- QUERIES E MUTATIONS ---
  type Query {
    # Pessoas
    obterPessoaPorId(id: ID!): Pessoa
    listarPessoas(pagina: Int = 1, limite: Int = 10): PaginaPessoas!

    # Exercícios
    obterExercicioPorId(idExercicio: ID!): Exercicio
    listarExercicios: [Exercicio!]!

    # Sessões e Séries
    obterSessaoAtiva(idPessoa: ID!): SessaoTreino
    listarSeriesPorSessao(idSessao: ID!): [Serie!]!
  }

  type Mutation {
    # Pessoas
    criarPessoa(input: CreatePessoaInput!): Pessoa!
    atualizarPessoa(input: UpdatePessoaInput!): Pessoa!
    deletarPessoa(id: ID!): Boolean!

    # Exercícios
    criarExercicio(input: CreateExercicioInput!): Exercicio!

    # Sessões e Séries
    iniciarSessao(input: IniciarSessaoTreinoInput!): SessaoTreino!
    finalizarSessao(input: FinalizarSessaoTreinoInput!): SessaoTreino!
    registrarSerie(input: RegistrarSerieInput!): Serie!
  }
`;