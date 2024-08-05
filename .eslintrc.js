module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
		'@typescript-eslint/eslint-plugin',
		'prettier',
	],
  ignorePatterns: [
    '.eslintrc.js',
    'dist'
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  },
}
