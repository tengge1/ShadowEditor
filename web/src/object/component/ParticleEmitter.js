/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 粒子发射器
 * @param {SPE.Group} group 粒子组
 * @param {SPE.Emitter} emitter 粒子发射器
 */
function ParticleEmitter(group, emitter) {
    THREE.Object3D.call(this);

    group = group || new SPE.Group({
        texture: {
            value: new THREE.TextureLoader().load('assets/textures/SPE/smokeparticle.png')
        },
        maxParticleCount: 2000
    });

    emitter = emitter || new SPE.Emitter({
        maxAge: {
            value: 2
        },
        position: {
            value: new THREE.Vector3(0, 0, 0),
            spread: new THREE.Vector3(0, 0, 0)
        },

        acceleration: {
            value: new THREE.Vector3(0, -10, 0),
            spread: new THREE.Vector3(10, 0, 10)
        },

        velocity: {
            value: new THREE.Vector3(0, 25, 0),
            spread: new THREE.Vector3(10, 7.5, 10)
        },

        color: {
            value: [new THREE.Color('white'), new THREE.Color('red')]
        },

        size: {
            value: 1
        },

        particleCount: 2000
    });

    group.addEmitter(emitter);

    group.mesh.name = _t('Particle');

    this.add(group.mesh);

    this.name = _t('ParticleEmitter');

    Object.assign(this.userData, {
        type: 'ParticleEmitter',
        group: group,
        emitter: emitter
    });
}

ParticleEmitter.prototype = Object.create(THREE.Object3D.prototype);
ParticleEmitter.prototype.constructor = ParticleEmitter;

export default ParticleEmitter;