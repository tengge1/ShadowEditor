/**
 * 具有一定体积的矩形光帮助器
 * @param {*} light 
 * @param {*} color 
 */
function VolumeRectAreaLightHelper(light, color) {
    THREE.RectAreaLightHelper.call(this, light, color);

    // TODO: three.js bugs： 未设置矩形光帮助器矩阵
    this.matrix = light.matrixWorld;
    this.matrixAutoUpdate = false;

    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    this.picker = new THREE.Mesh(geometry, material);
    this.picker.name = 'picker';
    this.add(this.picker);
}

VolumeRectAreaLightHelper.prototype = Object.create(THREE.RectAreaLightHelper.prototype);
VolumeRectAreaLightHelper.prototype.constructor = VolumeRectAreaLightHelper;

VolumeRectAreaLightHelper.prototype.raycast = function (raycaster, intersects) {
    var intersect = raycaster.intersectObject(this.picker)[0];
    if (intersect) {
        intersect.object = this.light;
        intersects.push(intersect);
    }
};

VolumeRectAreaLightHelper.prototype.dispose = function () {
    this.remove(this.picker);

    this.picker.geometry.dispose();
    this.picker.material.dispose();
    delete this.picker;

    THREE.RectAreaLightHelper.prototype.dispose.call(this);
};

export default VolumeRectAreaLightHelper;