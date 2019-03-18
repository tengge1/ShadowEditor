import GlobeVertex from './shader/globe_vertex.glsl';
import GlobeFragment from './shader/globe_fragment.glsl';
import BingTileSystem from './layer/BingTileSystem';

/**
 * 地球材质
 */
function GlobeMaterial() {
    var url = (new BingTileSystem()).tileXYToUrl(0, 0, 1);

    THREE.RawShaderMaterial.call(this, {
        vertexShader: GlobeVertex,
        fragmentShader: GlobeFragment,
        uniforms: {
            map: {
                type: 't',
                value: new THREE.TextureLoader().load(url)
            }
        },
        side: THREE.DoubleSide,
    });
}

GlobeMaterial.prototype = Object.create(THREE.RawShaderMaterial.prototype);
GlobeMaterial.prototype.constructor = GlobeMaterial;

export default GlobeMaterial;