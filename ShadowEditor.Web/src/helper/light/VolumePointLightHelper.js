/**
 * 具有一定体积的点光源帮助器
 * @author tengge / https://github.com/tengge1
 * @param {*} light 
 * @param {*} sphereSize 
 * @param {*} color 
 */
function VolumePointLightHelper(light, sphereSize, color) {
    THREE.PointLightHelper.call(this, light, sphereSize, color);

    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    this.picker = new THREE.Mesh(geometry, material);
    this.picker.name = 'picker';
    this.add(this.picker);
}

VolumePointLightHelper.prototype = Object.create(THREE.PointLightHelper.prototype);
VolumePointLightHelper.prototype.constructor = VolumePointLightHelper;

VolumePointLightHelper.prototype.raycast = function (raycaster, intersects) {
    var intersect = raycaster.intersectObject(this.picker)[0];
    if (intersect) {
        intersect.object = this.light;
        intersects.push(intersect);
    }
};

VolumePointLightHelper.prototype.dispose = function () {
    this.remove(this.picker);

    this.picker.geometry.dispose();
    this.picker.material.dispose();
    delete this.picker;

    THREE.PointLightHelper.prototype.dispose.call(this);
};

export default VolumePointLightHelper;