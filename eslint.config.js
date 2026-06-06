import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    // Les fichiers .astro sont vérifiés par Astro lui-même (et formatés par
    // Prettier) ; ESLint ne lint que le JS client et les fichiers de config.
    ignores: ['dist/**', 'node_modules/**', '.astro/**', 'ai/**', '.ai/**', 'trash/**'],
  },
  js.configs.recommended,
  {
    // Fichiers exécutés côté Node (config Astro, scripts de build) : globales Node
    // (process, URL, console…).
    files: ['*.config.{js,mjs}', 'scripts/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Injecté par le script Google Calendar (chargé async dans index.html)
        calendar: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
];
