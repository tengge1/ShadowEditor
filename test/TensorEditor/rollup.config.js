import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';

export default {
    input: 'test/TensorEditor/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'AI',
        file: 'ShadowEditor.AI/build/ShadowEditor.AI.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        resolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': '"development"' // production
        }),
        postcss({
            extract: true,
        }),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
