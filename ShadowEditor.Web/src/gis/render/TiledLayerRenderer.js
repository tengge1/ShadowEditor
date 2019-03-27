import Renderer from './Renderer';
import TiledGeometry from './geometry/TiledGeometry';
import TiledMaterial from './material/TiledMaterial';

/**
 * 瓦片图层渲染器
 * @param {*} globe 
 */
function TiledLayerRenderer(globe) {
    Renderer.call(this, globe);

    var geometry = new TiledGeometry();
    var material = new TiledMaterial();

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;

    this.globe.add(this.mesh);
}

TiledLayerRenderer.prototype = Object.create(Renderer.prototype);
TiledLayerRenderer.prototype.constructor = TiledLayerRenderer;

TiledLayerRenderer.prototype.render = function (layer) {
    // this.globe.children.length = 0;
    // this.globe.add(this.mesh);
};

TiledLayerRenderer.prototype.dispose = function () {
    Renderer.prototype.dispose.call(this);
};

export default TiledLayerRenderer;