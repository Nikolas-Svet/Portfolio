import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        'import/no-extraneous-dependencies': 'off'
    }
})

module.exports = {
    settings: {
        'import/resolver': {
            typescript: {
                project: '.'
            }
        }
    }
}