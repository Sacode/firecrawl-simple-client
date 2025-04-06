import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Base configuration for all files
    {
        ignores: ['dist/**', 'node_modules/**', 'scripts/**', 'src/client/**'],
    },

    // TypeScript files configuration
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
            globals: {
                // Node and browser environments
                ...Object.fromEntries(
                    ['console', 'process', 'module', 'require', '__dirname', '__filename'].map(name => [name, 'readonly'])
                ),
                ...Object.fromEntries(
                    ['window', 'document', 'navigator', 'fetch'].map(name => [name, 'readonly'])
                ),
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'prettier': prettierPlugin,
        },
        rules: {
            // TypeScript recommended rules (from plugin:@typescript-eslint/recommended)
            ...typescriptEslint.configs.recommended.rules,

            // Explicitly define the @typescript-eslint/ban-ts-comment rule without using structuredClone
            '@typescript-eslint/ban-ts-comment': ['error', {
                'ts-expect-error': 'allow-with-description',
                'ts-ignore': 'allow-with-description',
                'ts-nocheck': 'allow-with-description',
                'minimumDescriptionLength': 3
            }],

            // Prettier rules (from plugin:prettier/recommended)
            'prettier/prettier': 'error',
        },
    },

    // Apply prettier config last to override any conflicting rules
    prettierConfig,
];