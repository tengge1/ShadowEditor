import GlobeVertex from './shader/globe_vertex.glsl';
import GlobeFragment from './shader/globe_fragment.glsl';

/**
 * 地球材质
 */
function GlobeMaterial() {
    THREE.ShaderMaterial.call(this, {
        vertexShader: GlobeVertex,
        fragmentShader: GlobeFragment
    });
}

GlobeMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
GlobeMaterial.prototype.constructor = GlobeMaterial;

export default GlobeMaterial;