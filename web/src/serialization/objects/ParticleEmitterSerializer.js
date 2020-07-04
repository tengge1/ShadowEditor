/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';
import TexturesSerializer from '../texture/TexturesSerializer';
import ParticleEmitter from '../../object/component/ParticleEmitter';

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
        texture: new TexturesSerializer().toJSON(group.texture),
        maxParticleCount: group.maxParticleCount
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
                emitter.color.value[0].getHex(),
                emitter.color.value[1].getHex(),
                emitter.color.value[2].getHex(),
                emitter.color.value[3].getHex()
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

ParticleEmitterSerializer.prototype.fromJSON = function (json, parent, server) {
    var groupJson = json.userData.group;
    var emitterJson = json.userData.emitter;

    var group = new SPE.Group({
        texture: {
            value: new TexturesSerializer().fromJSON(groupJson.texture, undefined, server)
        },
        maxParticleCount: groupJson.maxParticleCount
    });

    var emitter = new SPE.Emitter({
        maxAge: {
            value: emitterJson.maxAge.value
        },
        position: {
            value: new THREE.Vector3().copy(emitterJson.position.value),
            spread: new THREE.Vector3().copy(emitterJson.position.spread)
        },

        acceleration: {
            value: new THREE.Vector3().copy(emitterJson.acceleration.value),
            spread: new THREE.Vector3().copy(emitterJson.acceleration.spread)
        },

        velocity: {
            value: new THREE.Vector3().copy(emitterJson.velocity.value),
            spread: new THREE.Vector3().copy(emitterJson.velocity.spread)
        },

        color: {
            value: [
                new THREE.Color(emitterJson.color.value[0]),
                new THREE.Color(emitterJson.color.value[1]),
                new THREE.Color(emitterJson.color.value[2]),
                new THREE.Color(emitterJson.color.value[3])
            ]
        },

        size: {
            value: emitterJson.size.value.slice(),
            spread: emitterJson.size.spread.slice()
        },

        particleCount: emitterJson.particleCount
    });

    var obj = new ParticleEmitter(group, emitter);

    delete json.userData.group;
    delete json.userData.emitter;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.userData.group.tick(0);

    return obj;
};

export default ParticleEmitterSerializer;