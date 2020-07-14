import bundleWorker from 'rollup-plugin-bundle-worker';

export default {
    input: 'main.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Test',
        file: 'build.js'
    },
    plugins: [
        bundleWorker()
    ]
};