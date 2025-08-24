import js from '@eslint/js';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config([
  { ignores: ['dist', 'eslint.config.js'] },
  ...compat.extends('airbnb'),
  ...compat.extends('plugin:react-hooks/recommended'),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'always',
          tsx: 'always',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.tsx', '.jsx'] },
      ],
      'react/jsx-one-expression-per-line': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },
]);
