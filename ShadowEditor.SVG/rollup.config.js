import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'ShadowEditor.SVG/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.SVG/dist/ShadowEditor.SVG.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        postcss({
            extensions: ['.css'],
        }),
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        // copy({
        //     "./assets/": "./dist/assets/"
        // })
    ]
};
