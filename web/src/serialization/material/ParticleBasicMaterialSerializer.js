import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ParticleBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function ParticleBasicMaterialSerializer() {
    BaseSerializer.call(this);
}

ParticleBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ParticleBasicMaterialSerializer.prototype.constructor = ParticleBasicMaterialSerializer;

ParticleBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ParticleBasicMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.ParticleBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default ParticleBasicMaterialSerializer;