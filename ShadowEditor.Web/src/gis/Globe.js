import Renderers from './render/Renderers';
import OrbitViewer from './view/OrbitViewer';
import GeoUtils from './utils/GeoUtils';

import GoogleTiledLayer from './layer/tiled/image/GoogleTiledLayer';
import TiandituTiledLayer from './layer/tiled/image/TiandituTiledLayer';
import BingTiledLayer from './layer/tiled/image/BingTiledLayer';

/**
 * 地球
 * @author tengge / https://github.com/tengge1
 * @param {THREE.PerspectiveCamera} camera 相机
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @param {Object} options 配置
 * @param {String} options.server 服务端配置
 * @param {Number} options.maxThread 最大工作线程数，避免任务创建过多，导致地图卡顿
 */
function Globe(camera, renderer, options = {}) {
    THREE.Object3D.call(this);

    options.server = options.server || location.origin;
    options.maxThread = options.maxThread || 10;

    this.name = L_GLOBE;

    this.isGlobe = true;

    this.camera = camera;
    this.renderer = renderer;
    this.options = options;

    this.thread = 0; // 当前线程总数
    this.matrixAutoUpdate = false;

    // 不能命名为layers，否则跟three.js的layers冲突
    this.layerList = [
        //new GoogleTiledLayer(this),
        //new TiandituTiledLayer(this),
        new BingTiledLayer(this),
    ];

    this.renderers = new Renderers(this);
    this.viewer = new OrbitViewer(this.camera, this.renderer.domElement);

    this.viewer.setPosition(0, 0, GeoUtils.zoomToAlt(0));
}

Globe.prototype = Object.create(THREE.Object3D.prototype);
Globe.prototype.constructor = Globe;

/**
 * 需要由应用程序连续调用
 */
Globe.prototype.update = function () {
    this.renderers.render();
    this.viewer.update();
};

/**
 * 释放占用的所有资源
 */
Globe.prototype.dispose = function () {
    this.renderers.dispose();
    this.viewer.dispose();

    this.layerList.forEach(n => {
        n.dispose();
    });

    delete this.layerList;
    delete this.renderers;
    delete this.viewer;

    delete this.camera;
    delete this.renderer;
};

export default Globe;