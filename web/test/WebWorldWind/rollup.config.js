import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import strip from 'rollup-plugin-strip-banner';
import bundleWorker from 'rollup-plugin-bundle-worker';

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
                map: {
                    mappings: ''
                }
            };
        }
    };
}

export default {
    input: 'src/WorldWind.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'WorldWind',
        file: './build/WorldWind.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        bundleWorker(),
        glsl(),
        resolve(),
        commonjs(),
        strip()
    ],
    onwarn(warning, rollupWarn) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            rollupWarn(warning);
        }
    }
};
