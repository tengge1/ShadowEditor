import applyMatrix4 from './vec3/applyMatrix4.glsl';
import makeOrthographic from './mat4/makeOrthographic.glsl';
import makePerspective from './mat4/makePerspective.glsl';

Object.assign(THREE.ShaderChunk, {
    applyMatrix4: applyMatrix4,
    makeOrthographic: makeOrthographic,
    makePerspective: makePerspective,
});