module.exports = {
  extends: ['@antfu', 'plugin:storybook/recommended'],
  rules: {
    'arrow-parens': ['error', 'always'],
    'curly': ['error', 'multi-line'],
    'antfu/if-newline': ['off'],
    'antfu/top-level-function': ['off'],
  },
}
