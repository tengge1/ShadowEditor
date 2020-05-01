export default {
    input: 'ShadowEditor.Web/test/unit/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.Web/test/unit/build/tests.js'
    },
    treeshake: true,
    external: [],
    plugins: []
};
