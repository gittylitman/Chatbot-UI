module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true, 
        },
        project: './tsconfig.json', // חשוב ל־TypeScript
        tsconfigRootDir: __dirname,
    },
    plugins: [
        '@typescript-eslint',
        'react-hooks',
        'react-refresh',
        'prettier',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: ['dist/', 'node_modules/', 'src/components/ui/'],
    rules: {
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        'no-console': 'warn',
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
        'prettier/prettier': 'error',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            rules: {
            },
        },
    ],
};
