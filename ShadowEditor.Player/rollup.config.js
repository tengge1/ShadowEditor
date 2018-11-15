import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'ShadowEditor.Player/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.Player/dist/ShadowEditor.Player.js'
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
