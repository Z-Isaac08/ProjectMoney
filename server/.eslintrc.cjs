module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { 
    project: './tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'import/order': ['warn', { 'newlines-between': 'always' }],
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
};