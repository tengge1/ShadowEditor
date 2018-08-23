import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ParticleBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ParticleBasicMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

ParticleBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ParticleBasicMaterialSerializer.prototype.constructor = ParticleBasicMaterialSerializer;

ParticleBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ParticleBasicMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ParticleBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ParticleBasicMaterialSerializer;