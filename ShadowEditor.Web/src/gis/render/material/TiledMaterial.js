import TiledVertex from '../shader/tiled_vertex.glsl';
import TiledFragment from '../shader/tiled_fragment.glsl';
import BingTileSystem from '../../utils/BingTileSystem';

/**
 * 瓦片材质
 * @author tengge / https://github.com/tengge1
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function TiledMaterial(x, y, z) {
    THREE.ShaderMaterial.call(this);

    this.vertexShader = TiledVertex;
    this.fragmentShader = TiledFragment;
    this.side = THREE.BackSide;

    var map = new THREE.TextureLoader().load((new BingTileSystem()).tileXYToUrl(x, y, z));
    map.flipY = false;

    this.uniforms = {
        x: {
            type: 'i',
            value: x,
        },
        y: {
            type: 'i',
            value: y,
        },
        z: {
            type: 'i',
            value: z,
        },
        map: {
            type: 't',
            value: map,
        }
    };

    this.group = {
        start: 0,
        count: 1536,
        materialIndex: 0
    };
}

TiledMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
TiledMaterial.prototype.constructor = TiledMaterial;

export default TiledMaterial;