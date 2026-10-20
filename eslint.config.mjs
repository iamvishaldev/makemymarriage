import js from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import prettierConfig from 'eslint-config-prettier/flat';

/**
 * Airbnb ruleset (PlexiTech standard) for Next.js + TypeScript, with Prettier owning formatting.
 * ESLint stays on 9.x because the React, import and a11y plugins do not yet support ESLint 10;
 * see docs/decisions/0003-tooling-baseline.md.
 */
export default [
  {
    name: 'project/ignores',
    ignores: ['.next/**', 'coverage/**', 'node_modules/**', 'next-env.d.ts'],
  },

  // JavaScript / Airbnb base
  { name: 'js/config', ...js.configs.recommended },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,

  // React / Next.js
  plugins.react,
  plugins.reactHooks,
  plugins.reactA11y,
  plugins.next,
  ...configs.next.recommended,

  // TypeScript
  plugins.typescriptEslint,
  ...configs.base.typescript,
  ...configs.next.typescript,

  {
    name: 'project/no-console',
    // PlexiTech standard: no console output in production code; use src/server/logger.ts.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    name: 'project/react-19',
    files: ['**/*.tsx'],
    rules: {
      // React 19 removed defaultProps for function components; defaults live in the parameters.
      'react/require-default-props': ['error', { functions: 'defaultArguments' }],
    },
  },
  {
    name: 'project/error-hierarchy',
    // The AppError family is one cohesive unit; splitting it into six files adds no clarity.
    files: ['src/server/http/errors.ts'],
    rules: {
      'max-classes-per-file': 'off',
    },
  },
  {
    name: 'project/next-file-conventions',
    // Next.js requires named exports (GET, register, ...) in these files.
    files: ['src/app/**/route.ts', 'src/instrumentation.ts'],
    rules: {
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    name: 'project/ui-primitives',
    // Primitives forward native element props; spreading is their purpose.
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react/jsx-props-no-spreading': 'off',
    },
  },
  {
    name: 'project/tests-and-config',
    files: ['**/*.test.{ts,tsx}', 'tests/**/*.ts', '*.config.{mjs,ts}'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
      // Native ESM config files need explicit extensions (e.g. `next/jest.js`).
      'import-x/extensions': 'off',
    },
  },

  // Must stay last: disables every rule that conflicts with Prettier.
  prettierConfig,
];
