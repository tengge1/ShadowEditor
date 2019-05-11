import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';

export default {
    input: 'ShadowEditor.UI/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.UI/build/ShadowEditor.UI.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        resolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': '"production"'
        }),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
