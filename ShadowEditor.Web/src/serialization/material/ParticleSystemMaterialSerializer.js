import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ParticleSystemMaterialSerializer
 */
function ParticleSystemMaterialSerializer() {
    BaseSerializer.call(this);
}

ParticleSystemMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ParticleSystemMaterialSerializer.prototype.constructor = ParticleSystemMaterialSerializer;

ParticleSystemMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ParticleSystemMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ParticleSystemMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ParticleSystemMaterialSerializer;