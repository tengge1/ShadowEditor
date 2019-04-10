import Renderers from './render/Renderers';
import OrbitViewer from './view/OrbitViewer';
import GeoUtils from './utils/GeoUtils';

import GoogleTiledLayer from './layer/tiled/image/GoogleTiledLayer';

/**
 * 地球
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} options 
 */
function Globe(camera, renderer, options) {
    THREE.Object3D.call(this);

    this.name = L_GLOBE;

    this.isGlobe = true;

    this.camera = camera;
    this.renderer = renderer;
    this.options = options;

    this.lon = 0;
    this.lat = 0;
    this.alt = GeoUtils.zoomToAlt(0);

    this.matrixAutoUpdate = false;

    // 不能命名为layers，否则跟three.js的layers冲突
    this.mapLayers = [
        new GoogleTiledLayer(),
    ];

    this.gisRenderer = new Renderers(this);
    this.viewer = new OrbitViewer(this.camera, this.renderer.domElement);

    this.viewer.setPosition(this.lon, this.lat, this.alt);
}

Globe.prototype = Object.create(THREE.Object3D.prototype);
Globe.prototype.constructor = Globe;

Globe.prototype.update = function () {
    this.gisRenderer.render();
    this.viewer.update();
};

Globe.prototype.dispose = function () {
    this.gisRenderer.dispose();
    this.viewer.dispose();

    this.mapLayers.forEach(n => {
        n.dispose();
    });

    delete this.mapLayers;
    delete this.tiledLayerRenderer;
    delete this.viewer;

    delete this.camera;
    delete this.renderer;
};

export default Globe;