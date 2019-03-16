/**
 * 具有一定体积的平行光帮助器
 * @param {*} light 
 * @param {*} size 
 * @param {*} color 
 */
function VolumeDirectionalLightHelper(light, size, color) {
    THREE.DirectionalLightHelper.call(this, light, size, color);

    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    this.picker = new THREE.Mesh(geometry, material);
    this.picker.name = 'picker';
    this.add(this.picker);
}

VolumeDirectionalLightHelper.prototype = Object.create(THREE.DirectionalLightHelper.prototype);
VolumeDirectionalLightHelper.prototype.constructor = VolumeDirectionalLightHelper;

VolumeDirectionalLightHelper.prototype.raycast = function (raycaster, intersects) {
    var intersect = raycaster.intersectObject(this.picker)[0];
    if (intersect) {
        intersect.object = this.light;
        intersects.push(intersect);
    }
};

VolumeDirectionalLightHelper.prototype.dispose = function () {
    this.remove(this.picker);

    this.picker.geometry.dispose();
    this.picker.material.dispose();
    delete this.picker;

    THREE.DirectionalLightHelper.prototype.dispose.call(this);
};

export default VolumeDirectionalLightHelper;