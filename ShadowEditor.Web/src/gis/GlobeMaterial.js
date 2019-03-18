import GlobeVertex from './shader/globe_vertex.glsl';
import GlobeFragment from './shader/globe_fragment.glsl';

/**
 * 地球材质
 */
function GlobeMaterial() {
    THREE.RawShaderMaterial.call(this, {
        vertexShader: GlobeVertex,
        fragmentShader: GlobeFragment
    });
}

GlobeMaterial.prototype = Object.create(THREE.RawShaderMaterial.prototype);
GlobeMaterial.prototype.constructor = GlobeMaterial;

export default GlobeMaterial;