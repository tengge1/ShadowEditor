import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
    input: 'ShadowEditor.UI/src/UI.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.UI/dist/ShadowUI.js'
    },
    treeshake: true,
    external: [],
    plugins: [
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
