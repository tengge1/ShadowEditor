import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'ShadowEditor.CodeEditor/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.CodeEditor/dist/ShadowEditor.CodeEditor.js'
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
