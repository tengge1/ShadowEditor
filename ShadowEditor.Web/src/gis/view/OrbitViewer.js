import Viewer from './Viewer';
import MathUtils from '../utils/MathUtils';

/**
 * 轨道查看器
 * @param {*} camera 相机
 * @param {*} domElement 文档
 */
function OrbitViewer(camera, domElement) {
    Viewer.call(this, camera, domElement);

    this.lon = 0;
    this.lat = 0;
    this.alt = MathUtils.zoomToAlt(1);
};

OrbitViewer.prototype = Object.create(Viewer.prototype);
OrbitViewer.prototype.constructor = OrbitViewer;

OrbitViewer.prototype.setPosition = function (lon, lat, alt) {
    var xyz = MathUtils.lonlatToXYZ(new THREE.Vector3(lon, lat, alt));
    this.camera.position.copy(xyz);
    this.camera.lookAt(new THREE.Vector3());
};

OrbitViewer.prototype.getPosition = function () {

};

OrbitViewer.prototype.update = function () {

};

OrbitViewer.prototype.dispose = function () {
    Viewer.prototype.dispose.call(this);
};

export default OrbitViewer;