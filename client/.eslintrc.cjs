module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  settings: { 
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'import/order': ['warn', { 
      'newlines-between': 'always',
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'alphabetize': { order: 'asc' }
    }],
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn'
  },
  ignorePatterns: ['dist', 'build', 'vite.config.js', 'tailwind.config.js']
};