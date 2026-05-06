import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import astroPlugin from 'eslint-plugin-astro';

export default tseslint.config(
  // Archivos ignorados
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },

  // Reglas base JS
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Archivos .tsx — React + hooks
  {
    files: ['**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',       // No hace falta importar React en React 17+
      'react/prop-types': 'off',               // TypeScript ya cubre esto
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // Archivos .astro
  ...astroPlugin.configs.recommended,

  // Reglas globales para todo el proyecto
  {
    files: ['**/*.{ts,tsx,astro}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
    },
  },
);
