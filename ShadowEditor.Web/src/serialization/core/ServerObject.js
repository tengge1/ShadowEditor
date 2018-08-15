import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * ServerObject
 * @param {*} app 
 */
function ServerObject(app) {
    BaseSerializer.call(this, app);
}

ServerObject.prototype = Object.create(BaseSerializer.prototype);
ServerObject.prototype.constructor = ServerObject;

ServerObject.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);
    json.userData = Object.assign({}, obj.userData);
    return json;
};

ServerObject.prototype.fromJSON = function (json) {
    var type = json.userData.Type;
    return new Promise((resolve, reject) => {
        if (type === 'amf') {
            var loader = new THREE.AMFLoader();
            loader.load(this.app.options.server + json.userData.Url, (group) => {
                Object3DSerializer.prototype.fromJSON.call(this, json, group);
                resolve(group);
            });
        } else if (type === 'binary') {
            var loader = new THREE.BinaryLoader();

            loader.load(this.app.options.server + json.userData.Url, (geometry, materials) => {
                var mesh = new THREE.Mesh(geometry, materials);

                Object3DSerializer.prototype.fromJSON.call(this, json, mesh);
                resolve(mesh);
            });
        } else if (type === 'awd') {
            var loader = new THREE.AWDLoader();

            loader.load(this.app.options.server + json.userData.Url, (obj3d) => {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj3d);
                resolve(obj3d);
            });
        } else if (type === 'babylon') {
            var loader = new THREE.BabylonLoader();

            loader.load(this.app.options.server + json.userData.Url, (scene) => {
                var obj3d = new THREE.Object3D();
                Object3DSerializer.prototype.fromJSON.call(this, json, obj3d);
                obj3d.children = scene.children;
                resolve(obj3d);
            });
        } else if (type === 'ctm') {
            var loader = new THREE.CTMLoader();

            loader.load(this.app.options.server + json.userData.Url, (geometry) => {
                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                Object3DSerializer.prototype.fromJSON.call(this, json, mesh);
                resolve(mesh);
            });
        } else if (type === 'dae') {
            var loader = new THREE.ColladaLoader();

            loader.load(this.app.options.server + json.userData.Url, (collada) => {
                var obj3d = collada.scene;
                Object3DSerializer.prototype.fromJSON.call(this, json, obj3d);
                resolve(obj3d);
            });
        } else if (type === 'fbx') {
            var loader = new THREE.FBXLoader();

            loader.load(this.app.options.server + json.userData.Url, (obj3d) => {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj3d);
                resolve(obj3d);
            });
        } else if (type === 'glb' || type === 'gltf') {
            var loader = new THREE.GLTFLoader();

            loader.load(this.app.options.server + json.userData.Url, (result) => {
                var obj3d = result.scene;
                Object3DSerializer.prototype.fromJSON.call(this, json, obj3d);
                resolve(obj3d);
            });
        } else if (type === 'kmz') {
            var loader = new THREE.KMZLoader();

            loader.load(this.app.options.server + json.userData.Url, (collada) => {
                var obj3d = collada.scene;
                Object3DSerializer.prototype.fromJSON.call(this, json, obj3d);
                resolve(obj3d);
            });
        } else if (type === 'ply') {
            var loader = new THREE.PLYLoader();

            loader.load(this.app.options.server + json.userData.Url, (geometry) => {
                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                Object3DSerializer.prototype.fromJSON.call(this, json, mesh);
                resolve(mesh);
            });
        } else if (type === 'obj') {
            var loader = new THREE.OBJLoader();

            loader.load(this.app.options.server + json.userData.Url, (obj) => {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj);
                resolve(obj);
            });
        } else if (type === 'md2') {
            var loader = new THREE.MD2Loader();

            loader.load(this.app.options.server + json.userData.Url, (geometry) => {
                var material = new THREE.MeshStandardMaterial({
                    morphTargets: true,
                    morphNormals: true
                });

                var mesh = new THREE.Mesh(geometry, material);
                mesh.mixer = new THREE.AnimationMixer(mesh);

                Object3DSerializer.prototype.fromJSON.call(this, json, mesh);
                resolve(mesh);
            });
        } else if (type === 'stl') {
            var loader = new THREE.STLLoader();

            loader.load(this.app.options.server + json.userData.Url, (geometry) => {
                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);
                Object3DSerializer.prototype.fromJSON.call(this, json, mesh);
                resolve(mesh);
            });
        } else {
            console.warn(`MeshSerializer: 未知模型类型${type}。`);
            resolve(null);
        }
    });

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ServerObject;