/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import applyMatrix4 from './vec3/applyMatrix4.glsl';
import lengthSq from './vec3/lengthSq.glsl';
import angleTo from './vec3/angleTo.glsl';

import makeOrthographic from './mat4/makeOrthographic.glsl';
import makePerspective from './mat4/makePerspective.glsl';
import makePerspective2 from './mat4/makePerspective2.glsl';
import determinant from './mat4/determinant.glsl';
import compose from './mat4/compose.glsl';
import decomposeMatrix from './mat4/decomposeMatrix.glsl';

import mercator from './geo/mercator.glsl';
import mercatorInvert from './geo/mercatorInvert.glsl';

Object.assign(THREE.ShaderChunk, {
    // vec3
    applyMatrix4: applyMatrix4,
    lengthSq: lengthSq,
    angleTo: angleTo,

    // mat4
    makeOrthographic: makeOrthographic,
    makePerspective: makePerspective,
    makePerspective2: makePerspective2,
    determinant: determinant,
    compose: compose,
    decomposeMatrix: decomposeMatrix,

    // geo
    mercator: mercator,
    mercatorInvert: mercatorInvert
});