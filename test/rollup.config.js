export default {
    input: 'test/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'test/dist/tests.js'
    },
    treeshake: true,
    external: [],
    plugins: []
};
