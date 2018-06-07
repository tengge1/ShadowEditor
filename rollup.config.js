import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';

function glsl() {
    return {
        transform(code, id) {
            if (/\.glsl$/.test(id) === false) return;

            var transformedCode = 'export default ' + JSON.stringify(
                code
                    .replace(/[ \t]*\/\/.*\n/g, '') // remove //
                    .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
                    .replace(/\n{2,}/g, '\n') // # \n+ to \n
            ) + ';';
            return {
                code: transformedCode,
                map: { mappings: '' }
            };
        }
    };
}

export default {
    input: 'src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'THREE',
        file: 'dist/BubbleEditor.js'
    },
    external: [],
    plugins: [
        glsl(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            externalHelpers: false
        }),
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        copy({
            "./assets/": "./dist/assets/",
            "./third_party/codemirror/codemirror.css": "./dist/assets/css/codemirror.css",
            "./third_party/codemirror/theme/monokai.css": "./dist/assets/css/monokai.css"
        })
    ]
};
