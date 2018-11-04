import resolve from 'rollup-plugin-node-resolve';

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
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        })
    ]
};
