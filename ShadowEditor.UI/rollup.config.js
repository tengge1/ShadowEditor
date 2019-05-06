// import commonjs from 'rollup-plugin-commonjs';
// import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

// import jss from 'jss'
// import preset from 'jss-preset-default'

// jss.setup(preset());

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
        // resolve(),
        // commonjs(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
