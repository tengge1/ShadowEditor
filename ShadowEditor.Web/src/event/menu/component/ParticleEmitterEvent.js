import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 粒子发射器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ParticleEmitterEvent(app) {
    MenuEvent.call(this, app);
    this.groups = [];
}

ParticleEmitterEvent.prototype = Object.create(MenuEvent.prototype);
ParticleEmitterEvent.prototype.constructor = ParticleEmitterEvent;

ParticleEmitterEvent.prototype.start = function () {
    var _this = this;
    this.app.on(`mParticleEmitter.${this.id}`, this.onAddParticleEmitter.bind(this));
    this.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
};

ParticleEmitterEvent.prototype.stop = function () {
    this.app.on(`mParticleEmitter.${this.id}`, null);
    this.app.on('objectRemoved.' + this.id, null);
};

ParticleEmitterEvent.prototype.onAddParticleEmitter = function () {
    var group = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture('assets/textures/SPE/smokeparticle.png')
        }
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
    this.app.editor.scene.add(group.mesh);

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));

    this.groups.push(group);
};

ParticleEmitterEvent.prototype.onObjectRemoved = function (object) {
    var index = this.groups.findIndex(function (n) {
        return n.mesh === object;
    });
    if (index > -1) {
        this.groups.splice(index, 1);
    }

    if (this.groups.length === 0) {
        this.app.on(`animate.` + this.id, null);
    }
};

ParticleEmitterEvent.prototype.onAnimate = function (clock, deltaTime) {
    this.groups.forEach((group) => {
        group.tick(deltaTime);
    });
};

export default ParticleEmitterEvent;