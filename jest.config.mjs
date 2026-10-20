import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/**
 * Server code is the default test environment. UI tests opt into a browser DOM
 * with a `@jest-environment jsdom` docblock at the top of the test file.
 *
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest-dom.ts'],
  moduleNameMapper: {
    '^server-only$': '<rootDir>/tests/setup/server-only-stub.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/tests/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    // Framework wiring with no logic of its own.
    '!src/app/layout.tsx',
    '!src/instrumentation.ts',
  ],
  // PlexiTech standard: 80% overall, 95% for critical / security-related code.
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
    './src/server/http/': { branches: 95, functions: 95, lines: 95, statements: 95 },
  },
};

export default createJestConfig(config);
