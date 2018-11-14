import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'ShadowEditor.ScriptEditor/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.ScriptEditor/dist/ShadowEditor.ScriptEditor.js'
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
