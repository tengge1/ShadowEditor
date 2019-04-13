import Renderers from './render/Renderers';
import OrbitViewer from './view/OrbitViewer';
import GeoUtils from './utils/GeoUtils';

import GoogleTiledLayer from './layer/tiled/image/GoogleTiledLayer';

/**
 * 地球
 * @author tengge / https://github.com/tengge1
 * @param {THREE.PerspectiveCamera} camera 相机
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @param {Object} options 配置
 * @param {String} options.server 服务端配置
 * @param {Boolean} options.enableTileCache 是否启用底图缓存
 * @param {Number} options.maxThread 最大工作线程数，避免任务创建过多，导致地图卡顿
 */
function Globe(camera, renderer, options = {}) {
    THREE.Object3D.call(this);

    options.server = options.server || location.origin;
    options.enableTileCache = options.enableTileCache || false;
    options.maxThread = options.maxThread || 10;

    this.name = L_GLOBE;

    this.isGlobe = true;

    this.camera = camera;
    this.renderer = renderer;
    this.options = options;

    this.lon = 0;
    this.lat = 0;
    this.alt = GeoUtils.zoomToAlt(0);

    this.thread = 0;
    this.matrixAutoUpdate = false;

    // 不能命名为layers，否则跟three.js的layers冲突
    this.layerList = [
        new GoogleTiledLayer(this),
    ];

    this.renderers = new Renderers(this);
    this.viewer = new OrbitViewer(this.camera, this.renderer.domElement);

    this.viewer.setPosition(this.lon, this.lat, this.alt);
}

Globe.prototype = Object.create(THREE.Object3D.prototype);
Globe.prototype.constructor = Globe;

Globe.prototype.update = function () {
    this.renderers.render();
    this.viewer.update();
};

Globe.prototype.dispose = function () {
    this.renderers.dispose();
    this.viewer.dispose();

    this.layerList.forEach(n => {
        n.dispose();
    });

    delete this.layerList;
    delete this.tiledLayerRenderer;
    delete this.viewer;

    delete this.camera;
    delete this.renderer;
};

export default Globe;