export default {
    input: 'ShadowEditor.Web/test/weekend/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Weekend',
        file: 'ShadowEditor.Web/test/weekend/build/weekend.js'
    },
    treeshake: true,
    external: [],
    plugins: []
};
