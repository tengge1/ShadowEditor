/**
 * 具有一定体积的聚光灯帮助器
 * @param {*} light 
 * @param {*} color 
 */
function VolumeSpotLightHelper(light, color) {
    THREE.SpotLightHelper.call(this, light, color);

    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    this.picker = new THREE.Mesh(geometry, material);
    this.picker.name = 'picker';
    this.add(this.picker);
}

VolumeSpotLightHelper.prototype = Object.create(THREE.SpotLightHelper.prototype);
VolumeSpotLightHelper.prototype.constructor = VolumeSpotLightHelper;

VolumeSpotLightHelper.prototype.raycast = function (raycaster, intersects) {
    var intersect = raycaster.intersectObject(this.picker)[0];
    if (intersect) {
        intersect.object = this.light;
        intersects.push(intersect);
    }
};

VolumeSpotLightHelper.prototype.dispose = function () {
    this.remove(this.picker);

    this.picker.geometry.dispose();
    this.picker.material.dispose();
    delete this.picker;

    THREE.SpotLightHelper.prototype.dispose.call(this);
};

export default VolumeSpotLightHelper;