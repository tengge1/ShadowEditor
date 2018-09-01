import BaseLoader from './BaseLoader';

/**
 * ObjectLoader（json文件加载器）
 * @author tengge / https://github.com/tengge1
 */
function ObjectLoader() {
    BaseLoader.call(this);
}

ObjectLoader.prototype = Object.create(BaseLoader.prototype);
ObjectLoader.prototype.constructor = ObjectLoader;

ObjectLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.ObjectLoader();

        loader.load(url, obj => {
            if (obj instanceof THREE.Scene && obj.children.length > 0 && obj.children[0] instanceof THREE.SkinnedMesh) {
                resolve(this.loadSkinnedMesh(obj));
            } else {
                resolve(obj);
            }
        }, undefined, () => {
            resolve(null);
        });
    });
};

ObjectLoader.prototype.loadSkinnedMesh = function (scene) {
    var mesh = null;

    scene.traverse(child => {
        if (child instanceof THREE.SkinnedMesh) {
            mesh = child;
        }
    });

    return mesh;
};

export default ObjectLoader;