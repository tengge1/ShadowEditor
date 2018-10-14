import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';
import TexturesSerializer from '../texture/TexturesSerializer';

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
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.children.length = 0;

    var group = json.userData.group;
    var emitter = json.userData.emitter;

    json.userData.group = {
        texture: (new TexturesSerializer()).toJSON(group.texture)
    };

    json.userData.emitter = {
        position: {
            value: {
                x: emitter.position.value.x,
                y: emitter.position.value.y,
                z: emitter.position.value.z
            },
            spread: {
                x: emitter.position.spread.x,
                y: emitter.position.spread.y,
                z: emitter.position.spread.z
            }
        },
        velocity: {
            value: {
                x: emitter.velocity.value.x,
                y: emitter.velocity.value.y,
                z: emitter.velocity.value.z
            },
            spread: {
                x: emitter.velocity.spread.x,
                y: emitter.velocity.spread.y,
                z: emitter.velocity.spread.z
            }
        },
        acceleration: {
            value: {
                x: emitter.acceleration.value.x,
                y: emitter.acceleration.value.y,
                z: emitter.acceleration.value.z
            },
            spread: {
                x: emitter.acceleration.spread.x,
                y: emitter.acceleration.spread.y,
                z: emitter.acceleration.spread.z
            }
        },
        color: {
            value: [
                emitter.color.value[0].getHexString(),
                emitter.color.value[1].getHexString(),
                emitter.color.value[2].getHexString(),
                emitter.color.value[3].getHexString()
            ]
        },
        size: {
            value: emitter.size.value,
            spread: emitter.size.spread
        },
        particleCount: emitter.particleCount,
        maxAge: {
            value: emitter.maxAge.value,
            spread: emitter.maxAge.spread
        }
    };

    return json;
};

ParticleEmitterSerializer.prototype.fromJSON = function (json, parent, camera) {

    debugger

    return obj.mesh;
};

export default ParticleEmitterSerializer;