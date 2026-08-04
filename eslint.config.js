import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    ignores: [
      'src/**/*.json',
      'shims.d.ts',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['src/**/*.vue', 'src/**/*.ts', 'test/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      'arrow-parens': ['error', 'always'],
      'style/arrow-parens': ['error', 'always'],
      'curly': ['error', 'multi-line'],
      'antfu/if-newline': ['off'],
      'antfu/top-level-function': ['off'],
    },
  },
)
