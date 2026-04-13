import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: '.',
      },
    }
  },
})
