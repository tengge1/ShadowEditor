import Renderer from './Renderer';
import TiledGeometry from './geometry/TiledGeometry';
import SphereTileCreator from '../tile/SphereTileCreator';

/**
 * 瓦片图层渲染器
 * @param {*} globe 
 */
function TiledLayerRenderer(globe) {
    Renderer.call(this, globe);

    this.creator = new SphereTileCreator();

    var geometry = new TiledGeometry();

    this.mesh = new THREE.Mesh(geometry, []);
    this.mesh.frustumCulled = false;

    this.globe.add(this.mesh);
}

TiledLayerRenderer.prototype = Object.create(Renderer.prototype);
TiledLayerRenderer.prototype.constructor = TiledLayerRenderer;

TiledLayerRenderer.prototype.render = function (layer) {
    var lon = this.globe.lon;
    var lat = this.globe.lat;
    var alt = this.globe.alt;

    this.mesh.material.length = 0;
    this.mesh.geometry.groups.length = 0;

    this.creator.get(lon, lat, alt).forEach((n, i) => {
        if (n.material) {
            n.material.group.materialIndex = i;
            this.mesh.material.push(n.material);
            this.mesh.geometry.groups.push(n.material.group);
        }
    });
};

TiledLayerRenderer.prototype.dispose = function () {
    Renderer.prototype.dispose.call(this);

    this.mesh.geometry.dispose();

    this.mesh.materials.forEach(n => {
        n.dispose();
    });

    delete this.mesh;
};

export default TiledLayerRenderer;