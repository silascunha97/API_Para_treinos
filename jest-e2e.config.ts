import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',

  // Roda apenas os testes de ponta a ponta, isolados dos testes unitários
  testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],

  // Resolve o alias "@src/*" definido no tsconfig.json (usado pelos módulos
  // de infraestrutura/main importados indiretamente pelo servidor GraphQL)
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/test/setup-e2e.ts'],

  // Requisições reais (DB, cache, fila) tendem a ser mais lentas que testes unitários
  testTimeout: 30000,

  clearMocks: true,
};

// CommonJS explícito (em vez de `export default`) porque o package.json declara
// "type": "commonjs" — evita o warning do Node ao tentar carregar este arquivo como ESM.
module.exports = config;
