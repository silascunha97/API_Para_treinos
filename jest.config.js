const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/src/test'],

  // Define o padrão de arquivos de teste unitário (e2e roda à parte via jest-e2e.config.ts)
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/test/e2e/'],

  // Coleta de cobertura apenas das regras de negócio (Domínio e Casos de Uso)
  collectCoverageFrom: [
    'src/application/use-cases/**/*.ts',
    'src/domain/**/*.ts',
    '!src/**/*.dto.ts',
  ],
  coverageDirectory: 'coverage',

  // Limpa chamadas de mocks entre cada teste automaticamente
  clearMocks: true,
};

module.exports = config;