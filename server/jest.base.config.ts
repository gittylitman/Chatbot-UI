import type { Config } from '@jest/types';

export default async (coverageFileName = 'coverage-report'): Promise<Config.InitialOptions> => {
  return {
    roots: ['src', 'test'],
    collectCoverage: true,
    preset: 'ts-jest',
    cache: false,
    forceExit: true,
    globals: {
      'ts-jest': {
        tsconfig: './tsconfig.json',
      },
    },
    testLocationInResults: true,
    verbose: true,
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    testRegex: '.*(spec|e2e.test|integration.test).ts$',
    collectCoverageFrom: [
      'src/**/*.ts',
      '!<rootDir>/__test__/**/*.ts',
      '!<rootDir>/**/main.*.ts',
      '!<rootDir>/**/*.seed.ts',
      '!<rootDir>/**/*.module.ts',
    ],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    testResultsProcessor: 'jest-junit',
    reporters: ['default', 'jest-junit'],
    coverageReporters: ['text', ['cobertura', { file: `${coverageFileName}.xml` }]],
    coveragePathIgnorePatterns: ['/node_modules/', '/utils/', '/__fixtures__/', '/__test__/', '/__tests__/'],
    rootDir: '.',
    moduleNameMapper: {
      '@app/(.*)': '<rootDir>/src/modules/$1',
      '@test/(.*)': '<rootDir>/test/$1',
    },
  };
};
