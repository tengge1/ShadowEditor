import Viewer from './Viewer';
import WGS84 from '../core/WGS84';
import GeoUtils from '../utils/GeoUtils';

/**
 * 轨道查看器
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 相机
 * @param {*} domElement 文档
 * @description 鼠标的旋转和缩放操作，都应该转换为对相机的操作
 */
function OrbitViewer(camera, domElement) {
    Viewer.call(this, camera, domElement);

    this.sphere = new THREE.Sphere(undefined, WGS84.a);
    this.ray = new THREE.Ray();

    this.isDown = false;
    this.isPan = false;

    this.intersectPoint = new THREE.Vector3();
    this.aabb = new THREE.Box2(
        new THREE.Vector2(-Math.PI, -Math.PI / 2),
        new THREE.Vector2(Math.PI, Math.PI / 2),
    );

    this.rotationSpeed = new THREE.Vector3();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseWheel = this.onMouseWheel.bind(this);

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('mousewheel', this.onMouseWheel);

    this._updateAABB();
};

OrbitViewer.prototype = Object.create(Viewer.prototype);
OrbitViewer.prototype.constructor = OrbitViewer;

OrbitViewer.prototype.onMouseDown = function (event) {
    this.isDown = true;
    this.isPan = false;
};

OrbitViewer.prototype.onMouseMove = function () {
    var lastIntersectPoint = new THREE.Vector3();

    var unit1 = new THREE.Vector3();
    var unit2 = new THREE.Vector3();

    var yAxis = new THREE.Vector3(0, 1, 0);
    var minAngle = 45 * Math.PI / 180;
    var maxAngle = 135 * Math.PI / 180;
    var axis = new THREE.Vector3();

    var startTime = 0;
    var endTime = 0;
    var startLonLat = new THREE.Vector3();
    var endLonLat = new THREE.Vector3();

    var quat = new THREE.Quaternion();
    var dir = new THREE.Vector3();

    return function (event) {
        if (!this.isDown) {
            return;
        }

        if (!this.isPan) {
            if (!this.intersectSphere(event.offsetX, event.offsetY, this.intersectPoint)) { // 鼠标在地球外
                return;
            }

            this.isPan = true;
            lastIntersectPoint.copy(this.intersectPoint);

            startTime = new Date().getTime();
            GeoUtils.xyzToLonlat(this.camera.position, startLonLat);
            return;
        }

        if (!this.intersectSphere(event.offsetX, event.offsetY, this.intersectPoint)) { // 鼠标在地球外
            // 惯性旋转

            return;
        }

        unit1.copy(lastIntersectPoint).normalize();
        unit2.copy(this.intersectPoint).normalize();

        // unit2与y轴夹角不能太小和太大
        // TODO：bug 反弹回的角度不正确
        // 原因：应该使用中心点的，而不是碰撞点的。
        var angle = unit2.angleTo(yAxis);

        if (angle && Math.abs(angle) < minAngle) {
            axis.crossVectors(unit2, yAxis);
            axis.normalize();
            unit2.copy(yAxis);
            unit2.applyAxisAngle(axis, minAngle);
            this.intersectPoint.copy(unit2).multiplyScalar(WGS84.a);
        }

        // if (angle && Math.abs(angle) > maxAngle) {
        //     axis.crossVectors(unit2, yAxis);
        //     axis.normalize();
        //     unit2.copy(yAxis);
        //     unit2.applyAxisAngle(axis, -angle);
        // }

        // 计算相机新位置
        quat.setFromUnitVectors(unit2, unit1);

        var distance = this.camera.position.length();
        dir.copy(this.camera.position).normalize();
        dir.applyQuaternion(quat).normalize();

        this.camera.position.set(
            distance * dir.x,
            distance * dir.y,
            distance * dir.z,
        );

        this.camera.lookAt(this.sphere.center);

        // 计算旋转速度
        endTime = new Date().getTime();
        GeoUtils._xyzToLonlat(this.camera.position, endLonLat);

        // if (endTime > startTime) {
        //     this.rotationSpeed.subVectors(endLonLat, startLonLat)
        //         .multiplyScalar(endTime - startTime);
        // }

        lastIntersectPoint.copy(this.intersectPoint);
    };
}();

OrbitViewer.prototype.onMouseUp = function (event) {
    this.isDown = false;
    this.isPan = false;
    this._updateAABB();
};

OrbitViewer.prototype.onMouseWheel = function () {
    var dir = new THREE.Vector3();

    return function (event) {
        var delta = -event.wheelDelta;

        var distance = dir.copy(this.camera.position).length();
        dir.copy(this.camera.position).normalize();

        if (distance < WGS84.a) {
            distance = WGS84.a;
        }

        var d = delta * (distance - WGS84.a) / 1000;

        var d_1 = GeoUtils.zoomToAlt(2) + WGS84.a;

        if (distance + d >= d_1) { // 最远2层级距离
            d = 0;
        }

        var d_2 = GeoUtils.zoomToAlt(18) + WGS84.a;

        if (distance + d <= d_2) { // 最近18层级
            d = 0;
        }

        this.camera.position.set(
            this.camera.position.x + d * dir.x,
            this.camera.position.y + d * dir.y,
            this.camera.position.z + d * dir.z,
        );

        this._updateAABB();
    };
}();

/**
 * 计算屏幕坐标与地球表面交点
 * @param {float} x 屏幕坐标X
 * @param {float} y 屏幕坐标Y
 * @param {THREE.Vector3} intersectPoint 计算出的碰撞点
 */
OrbitViewer.prototype.intersectSphere = function () {
    var projectionMatrixInverse = new THREE.Matrix4();
    var matrixWorld = new THREE.Matrix4();

    return function (x, y, intersectPoint) {
        if (!this.isPan) {
            projectionMatrixInverse.getInverse(this.camera.projectionMatrix);
            matrixWorld.copy(this.camera.matrixWorld);
        }

        this.ray.origin.set(
            x / this.domElement.clientWidth * 2 - 1, -y / this.domElement.clientHeight * 2 + 1,
            0.1,
        );
        this.ray.direction.copy(this.ray.origin);
        this.ray.direction.z = 1;

        this.ray.origin.applyMatrix4(projectionMatrixInverse).applyMatrix4(matrixWorld);
        this.ray.direction.applyMatrix4(projectionMatrixInverse).applyMatrix4(matrixWorld).sub(this.ray.origin).normalize();

        return this.ray.intersectSphere(this.sphere, intersectPoint);
    };
}();

/**
 * 计算当前视锥内的经纬度范围
 */
OrbitViewer.prototype._updateAABB = function () {
    var min = new THREE.Vector3();
    var max = new THREE.Vector3();

    return function () {
        if (!this.intersectSphere(0, this.domElement.clientHeight, min)) { // 未发生碰撞
            this.aabb.min.set(-Math.PI, -Math.PI / 2);
            this.aabb.max.set(Math.PI, Math.PI / 2);
            return;
        }

        this.intersectSphere(this.domElement.clientWidth, 0, max);

        GeoUtils._xyzToLonlat(min, min);
        GeoUtils._xyzToLonlat(max, max);

        this.aabb.min.copy(min);
        this.aabb.max.copy(max);
    };
}();

OrbitViewer.prototype.setPosition = function (lon, lat, alt) {
    var xyz = GeoUtils.lonlatToXYZ(new THREE.Vector3(lon, lat, alt));
    this.camera.position.copy(xyz);
    this.camera.lookAt(new THREE.Vector3());
};

OrbitViewer.prototype.getPosition = function () {

};

OrbitViewer.prototype.update = function () {
    var lonlat = new THREE.Vector3();

    return function () {
        // if (this.isPan) {
        //     return;
        // }

        // if (this.rotationSpeed.x === 0 && this.rotationSpeed.y === 0) {
        //     return;
        // }

        // GeoUtils.xyzToLonlat(this.camera.position, lonlat);

        // lonlat.add(this.rotationSpeed);

        // if (this.rotationSpeed.x > 0) {
        //     this.rotationSpeed.x -= 1;
        //     if (this.rotationSpeed.x < 1) {
        //         this.rotationSpeed.x = 0;
        //     }
        // } else if (this.rotationSpeed.x < 0) {
        //     this.rotationSpeed.x += 0.01;
        //     if (this.rotationSpeed.x > -0.01) {
        //         this.rotationSpeed.x = 0;
        //     }
        // }

        // if (this.rotationSpeed.y > 0) {
        //     this.rotationSpeed.y -= 0.01;
        //     if (this.rotationSpeed.y < 0.01) {
        //         this.rotationSpeed.y = 0;
        //     }
        // } else if (this.rotationSpeed.y < 0) {
        //     this.rotationSpeed.y += 0.01;
        //     if (this.rotationSpeed.y > -0.01) {
        //         this.rotationSpeed.y = 0;
        //     }
        // }

        // GeoUtils.lonlatToXYZ(lonlat, this.camera.position);

        // this.camera.lookAt(this.sphere.center);
    };
}();

OrbitViewer.prototype.dispose = function () {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('mousewheel', this.onMouseWheel);

    Viewer.prototype.dispose.call(this);
};

export default OrbitViewer;