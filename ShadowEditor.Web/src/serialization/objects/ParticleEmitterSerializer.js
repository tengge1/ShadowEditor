import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';

/**
 * ParticleEmitterSerializer
 * @author tengge / https://github.com/tengge1
 */
function ParticleEmitterSerializer() {
    BaseSerializer.call(this);
}

ParticleEmitterSerializer.prototype = Object.create(BaseSerializer.prototype);
ParticleEmitterSerializer.prototype.constructor = ParticleEmitterSerializer;

ParticleEmitterSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    debugger

    return json;
};

ParticleEmitterSerializer.prototype.fromJSON = function (json, parent, camera) {

    debugger

    return obj.mesh;
};

export default ParticleEmitterSerializer;