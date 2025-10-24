import eslint from '@eslint/js';
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'
//import importPlugin from 'eslint-plugin-import'
import importAlias from '@dword-design/eslint-plugin-import-alias';


export default tseslint.config(
  {
    ignores: [
      'dist', 
      'node_modules',
      'public',
      'vite.config.ts',
      'eslint.config.js',
      //ignore shadcn components
      'src/components/ui/**/*',
    ]
  },
  {
    //...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked
    extends: [
      eslint.configs.recommended, 
      ...tseslint.configs.recommended, //recommended || recommendedTypeChecked
      importAlias.configs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2025,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['./tsconfig.json'],
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      prettier,
      // NOTE: This plugin is not included because it is not compatible with the latest version of tailwind v4 - eslint-plugin-tailwindcss
      //tailwindcss
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'semi': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^' }],
      'no-alert': 'error',
      'no-console': 'warn',
      // 'no-unused-vars': [
      //    "warn",
      //   { "argsIgnorePattern": "^_" }
      // ],
      'no-var': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      //'tailwindcss/classnames-order': 'warn',
      //'tailwindcss/no-custom-classname': 'off',
      'react/jsx-pascal-case': 'error',
      'require-await': 'error',
      //'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'start' }],
      '@dword-design/import-alias/prefer-alias': [
        'error',
        {
          "alias": {
            "@": "./src",
            //"@components": "./src/components"
          }
        }
      ]
      //'import/no-duplicates': ['error', {'prefer-inline': true}],
      // 'import/order': [
      //   'error',
      //   {
      //     groups: [
      //       'builtin',
      //       'external',
      //       'internal',
      //       ['parent', 'sibling'],
      //       'index',
      //     ],
      //     'newlines-between': 'always',
      //     alphabetize: { order: 'asc', caseInsensitive: true },
      //   },
      // ],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        //typescript: {}
      },
    },
  },
)
