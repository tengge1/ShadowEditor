import Viewer from './Viewer';
import WGS84 from '../core/WGS84';
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
    this.alt = MathUtils.zoomToAlt(0);

    this.sphere = new THREE.Sphere(undefined, WGS84.a);
    this.ray = new THREE.Ray();

    this.isDown = false;
    this.projectionMatrixInverse = new THREE.Matrix4();
    this.matrixWorld = new THREE.Matrix4();

    this.intersectPoint = new THREE.Vector3();
    this.oldIntersectPoint = new THREE.Vector3();

    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
};

OrbitViewer.prototype = Object.create(Viewer.prototype);
OrbitViewer.prototype.constructor = OrbitViewer;

OrbitViewer.prototype.onMouseDown = function (event) {
    this.isDown = true;
    this.projectionMatrixInverse.getInverse(this.camera.projectionMatrix);
    this.matrixWorld.copy(this.camera.matrixWorld);

    this.intersectSphere(event.offsetX, event.offsetY);
    this.oldIntersectPoint.copy(this.intersectPoint);
};

OrbitViewer.prototype.onMouseMove = function () {
    var unit1 = new THREE.Vector3();
    var unit2 = new THREE.Vector3();

    var quat = new THREE.Quaternion();
    var euler = new THREE.Euler();
    var dir = new THREE.Vector3();

    return function (event) {
        if (!this.isDown) {
            return;
        }
        this.intersectSphere(event.offsetX, event.offsetY);

        unit1.copy(this.oldIntersectPoint).normalize();
        unit2.copy(this.intersectPoint).normalize();

        quat.setFromUnitVectors(unit2, unit1);
        euler.setFromQuaternion(quat);

        var distance = this.camera.position.length();
        dir.copy(this.camera.position).normalize();
        dir.applyQuaternion(quat).normalize();

        this.camera.position.set(
            distance * dir.x,
            distance * dir.y,
            distance * dir.z,
        );

        this.camera.lookAt(this.sphere.center);

        this.oldIntersectPoint.copy(this.intersectPoint);
    };
}();

OrbitViewer.prototype.onMouseUp = function (event) {
    this.isDown = false;
};

/**
 * 计算屏幕坐标与地球表面交点
 * @param {*} x 屏幕坐标X
 * @param {*} y 屏幕坐标Y
 */
OrbitViewer.prototype.intersectSphere = function (x, y) {
    this.ray.origin.set(
        x / this.domElement.clientWidth * 2 - 1,
        -y / this.domElement.clientHeight * 2 + 1,
        0.1,
    );
    this.ray.direction.copy(this.ray.origin);
    this.ray.direction.z = 1;

    this.ray.origin.applyMatrix4(this.projectionMatrixInverse).applyMatrix4(this.matrixWorld);
    this.ray.direction.applyMatrix4(this.projectionMatrixInverse).applyMatrix4(this.matrixWorld).sub(this.ray.origin).normalize();

    this.ray.intersectSphere(this.sphere, this.intersectPoint);
};

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
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);

    Viewer.prototype.dispose.call(this);
};

export default OrbitViewer;