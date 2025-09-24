import { defineFlatConfig } from 'eslint-define-config'
import vuePlugin from 'eslint-plugin-vue'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import prettierConfig from '@vue/eslint-config-prettier'

export default defineFlatConfig([
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        browser: true,
        node: true
      }
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-extra-semi': 'error',
      'no-undef': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/no-mutating-props': 'off'
    },
    settings: {
      'vue/setup-compiler-macros': true
    }
  },
  prettierConfig
])
