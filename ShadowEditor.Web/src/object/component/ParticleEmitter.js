/**
 * 粒子发射器
 */
function ParticleEmitter() {
    THREE.Object3D.call(this);

    var group = new SPE.Group({
        texture: {
            value: new THREE.TextureLoader().load('assets/textures/SPE/smokeparticle.png')
        },
        maxParticleCount: 2000
    });

    var emitter = new SPE.Emitter({
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

    this.add(group.mesh);

    this.name = '粒子发射器';

    Object.assign(this.userData, {
        type: 'ParticleEmitter',
        group: group,
        emitter: emitter
    });
}

ParticleEmitter.prototype = Object.create(THREE.Object3D.prototype);
ParticleEmitter.prototype.constructor = ParticleEmitter;

export default ParticleEmitter;