import babel from 'rollup-plugin-babel';

export default {
    input: 'server/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'SS',
        file: 'server/dist/ShadowServer.js'
    },
    external: [],
    plugins: [
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            externalHelpers: false
        }),
    ]
};
