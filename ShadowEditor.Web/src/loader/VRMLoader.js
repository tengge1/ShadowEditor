import BaseLoader from './BaseLoader';

/**
 * VRMLoader
 * @author tengge / https://github.com/tengge1
 */
function VRMLoader() {
    BaseLoader.call(this);
}

VRMLoader.prototype = Object.create(BaseLoader.prototype);
VRMLoader.prototype.constructor = VRMLoader;

VRMLoader.prototype.load = function (url, options) {
    return new Promise(resolve => {
        this.require([
            'GLTFLoader',
            'VRMLoader'
        ]).then(() => {
            var loader = new THREE.VRMLoader();
            loader.load(url, vrm => {
                // VRMLoader doesn't support VRM Unlit extension yet so
                // converting all materials to MeshBasicMaterial here as workaround so far.
                vrm.scene.traverse(function (object) {
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            for (var i = 0, il = object.material.length; i < il; i++) {
                                var material = new THREE.MeshBasicMaterial();
                                THREE.Material.prototype.copy.call(material, object.material[i]);
                                material.color.copy(object.material[i].color);
                                material.map = object.material[i].map;
                                material.lights = false;
                                material.skinning = object.material[i].skinning;
                                material.morphTargets = object.material[i].morphTargets;
                                material.morphNormals = object.material[i].morphNormals;
                                object.material[i] = material;
                            }
                        } else {
                            var material = new THREE.MeshBasicMaterial();
                            THREE.Material.prototype.copy.call(material, object.material);
                            material.color.copy(object.material.color);
                            material.map = object.material.map;
                            material.lights = false;
                            material.skinning = object.material.skinning;
                            material.morphTargets = object.material.morphTargets;
                            material.morphNormals = object.material.morphNormals;
                            object.material = material;
                        }
                    }
                });

                resolve(vrm.scene);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default VRMLoader;