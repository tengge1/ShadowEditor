import TiledVertex from '../shader/tiled_vertex.glsl';
import TiledFragment from '../shader/tiled_fragment.glsl';
import BingTileSystem from '../../utils/BingTileSystem';

/**
 * 瓦片材质
 */
function TiledMaterial() {
    THREE.ShaderMaterial.call(this);

    this.vertexShader = TiledVertex;
    this.fragmentShader = TiledFragment;
    this.side = THREE.DoubleSide;

    var url = (new BingTileSystem()).tileXYToUrl(0, 0, 1);

    this.uniforms = {
        lon: {
            type: 'f',
            value: 0
        },
        alt: {
            type: 'f',
            value: 0
        },
        alt: {
            type: 'f',
            value: 0
        },
        map: {
            type: 't',
            value: new THREE.TextureLoader().load(url)
        }
    };
}

TiledMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
TiledMaterial.prototype.constructor = TiledMaterial;

export default TiledMaterial;