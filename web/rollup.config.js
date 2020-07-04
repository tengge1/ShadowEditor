/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import strip from 'rollup-plugin-strip-banner';

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
    input: 'src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: '../build/public/build/ShadowEditor.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        glsl(),
        resolve(),
        commonjs({
            exclude: [
                'assets/**'
            ]
        }),
        replace({
            'process.env.NODE_ENV': '"development"' // production
        }),
        postcss({
            extract: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        strip()
    ],
    onwarn(warning, rollupWarn) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            rollupWarn(warning);
        }
    }
};
