export default {
    input: 'ShadowEditor.PackageManager/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.PackageManager/dist/ShadowEditor.PackageManager.js'
    },
    treeshake: true,
    external: [],
    plugins: []
};
