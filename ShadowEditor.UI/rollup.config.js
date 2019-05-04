import babel from 'rollup-plugin-babel';

export default {
    input: 'ShadowEditor.UI/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.UI/build/ShadowEditor.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
