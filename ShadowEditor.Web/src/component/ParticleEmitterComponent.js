import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 粒子发射器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ParticleEmitterComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;

    this.isPlaying = false;
}

ParticleEmitterComponent.prototype = Object.create(BaseComponent.prototype);
ParticleEmitterComponent.prototype.constructor = ParticleEmitterComponent;

ParticleEmitterComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'particleEmitterPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'label',
            style: {
                width: '100%',
                color: '#555',
                fontWeight: 'bold'
            },
            text: L_PARTICLE_EMITTER
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_POSITION
            }, {
                xtype: 'number',
                id: 'positionX',
                scope: this.id,
                onChange: this.onChangePosition.bind(this)
            }, {
                xtype: 'number',
                id: 'positionY',
                scope: this.id,
                onChange: this.onChangePosition.bind(this)
            }, {
                xtype: 'number',
                id: 'positionZ',
                scope: this.id,
                onChange: this.onChangePosition.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_POSITION_SPREAD
            }, {
                xtype: 'number',
                id: 'positionSpreadX',
                scope: this.id,
                onChange: this.onChangePosition.bind(this)
            }, {
                xtype: 'number',
                id: 'positionSpreadY',
                scope: this.id,
                onChange: this.onChangePosition.bind(this)
            }, {
                xtype: 'number',
                id: 'positionSpreadZ',
                scope: this.id,
                onChange: this.onChangePosition.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_VELOCITY
            }, {
                xtype: 'number',
                id: 'velocityX',
                scope: this.id,
                onChange: this.onChangeVelocity.bind(this)
            }, {
                xtype: 'number',
                id: 'velocityY',
                scope: this.id,
                onChange: this.onChangeVelocity.bind(this)
            }, {
                xtype: 'number',
                id: 'velocityZ',
                scope: this.id,
                onChange: this.onChangeVelocity.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_VELOCITY_SPREAD
            }, {
                xtype: 'number',
                id: 'velocitySpreadX',
                scope: this.id,
                onChange: this.onChangeVelocity.bind(this)
            }, {
                xtype: 'number',
                id: 'velocitySpreadY',
                scope: this.id,
                onChange: this.onChangeVelocity.bind(this)
            }, {
                xtype: 'number',
                id: 'velocitySpreadZ',
                scope: this.id,
                onChange: this.onChangeVelocity.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ACCELERATION
            }, {
                xtype: 'number',
                id: 'accelerationX',
                scope: this.id,
                onChange: this.onChangeAcceleration.bind(this)
            }, {
                xtype: 'number',
                id: 'accelerationY',
                scope: this.id,
                onChange: this.onChangeAcceleration.bind(this)
            }, {
                xtype: 'number',
                id: 'accelerationZ',
                scope: this.id,
                onChange: this.onChangeAcceleration.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ACCELERATION_SPREAD
            }, {
                xtype: 'number',
                id: 'accelerationSpreadX',
                scope: this.id,
                onChange: this.onChangeAcceleration.bind(this)
            }, {
                xtype: 'number',
                id: 'accelerationSpreadY',
                scope: this.id,
                onChange: this.onChangeAcceleration.bind(this)
            }, {
                xtype: 'number',
                id: 'accelerationSpreadZ',
                scope: this.id,
                onChange: this.onChangeAcceleration.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_COLOR + '1'
            }, {
                xtype: 'color',
                id: 'color1',
                scope: this.id,
                onChange: this.onChangeColor.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_COLOR + '2'
            }, {
                xtype: 'color',
                id: 'color2',
                scope: this.id,
                onChange: this.onChangeColor.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_COLOR + '3'
            }, {
                xtype: 'color',
                id: 'color3',
                scope: this.id,
                onChange: this.onChangeColor.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_COLOR + '4'
            }, {
                xtype: 'color',
                id: 'color4',
                scope: this.id,
                onChange: this.onChangeColor.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SIZE
            }, {
                xtype: 'number',
                id: 'size',
                scope: this.id,
                onChange: this.onChangeSize.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SIZE_SPREAD
            }, {
                xtype: 'number',
                id: 'sizeSpread',
                scope: this.id,
                onChange: this.onChangeSize.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TEXTURE
            }, {
                xtype: 'texture',
                id: 'texture',
                scope: this.id,
                onChange: this.onChangeTexture.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_PARTICLE_COUNT
            }, {
                xtype: 'int',
                range: [1, Infinity],
                id: 'particleCount',
                scope: this.id,
                onChange: this.onChangeParticleCount.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_AGE
            }, {
                xtype: 'number',
                id: 'maxAge',
                scope: this.id,
                onChange: this.onChangeMaxAge.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_AGE_SPREAD
            }, {
                xtype: 'number',
                id: 'maxAgeSpread',
                scope: this.id,
                onChange: this.onChangeMaxAgeSpread.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label'
            }, {
                xtype: 'button',
                id: 'btnPreview',
                scope: this.id,
                text: L_PREVIEW,
                onClick: this.onPreview.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ParticleEmitterComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ParticleEmitterComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ParticleEmitterComponent.prototype.updateUI = function () {
    var container = UI.get('particleEmitterPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected.userData.type === 'ParticleEmitter') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var positionX = UI.get('positionX', this.id);
    var positionY = UI.get('positionY', this.id);
    var positionZ = UI.get('positionZ', this.id);

    var positionSpreadX = UI.get('positionSpreadX', this.id);
    var positionSpreadY = UI.get('positionSpreadY', this.id);
    var positionSpreadZ = UI.get('positionSpreadZ', this.id);

    var velocityX = UI.get('velocityX', this.id);
    var velocityY = UI.get('velocityY', this.id);
    var velocityZ = UI.get('velocityZ', this.id);

    var velocitySpreadX = UI.get('velocitySpreadX', this.id);
    var velocitySpreadY = UI.get('velocitySpreadY', this.id);
    var velocitySpreadZ = UI.get('velocitySpreadZ', this.id);

    var accelerationX = UI.get('accelerationX', this.id);
    var accelerationY = UI.get('accelerationY', this.id);
    var accelerationZ = UI.get('accelerationZ', this.id);

    var accelerationSpreadX = UI.get('accelerationSpreadX', this.id);
    var accelerationSpreadY = UI.get('accelerationSpreadY', this.id);
    var accelerationSpreadZ = UI.get('accelerationSpreadZ', this.id);

    var color1 = UI.get('color1', this.id);
    var color2 = UI.get('color2', this.id);
    var color3 = UI.get('color3', this.id);
    var color4 = UI.get('color4', this.id);

    var size = UI.get('size', this.id);
    var sizeSpread = UI.get('sizeSpread', this.id);
    var texture = UI.get('texture', this.id);
    var particleCount = UI.get('particleCount', this.id);
    var maxAge = UI.get('maxAge', this.id);
    var maxAgeSpread = UI.get('maxAgeSpread', this.id);
    var btnPreview = UI.get('btnPreview', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    positionX.setValue(emitter.position.value.x);
    positionY.setValue(emitter.position.value.y);
    positionZ.setValue(emitter.position.value.z);

    positionSpreadX.setValue(emitter.position.spread.x);
    positionSpreadY.setValue(emitter.position.spread.y);
    positionSpreadZ.setValue(emitter.position.spread.z);

    velocityX.setValue(emitter.velocity.value.x);
    velocityY.setValue(emitter.velocity.value.y);
    velocityZ.setValue(emitter.velocity.value.z);

    velocitySpreadX.setValue(emitter.velocity.spread.x);
    velocitySpreadY.setValue(emitter.velocity.spread.y);
    velocitySpreadZ.setValue(emitter.velocity.spread.z);

    accelerationX.setValue(emitter.acceleration.value.x);
    accelerationY.setValue(emitter.acceleration.value.y);
    accelerationZ.setValue(emitter.acceleration.value.z);

    accelerationSpreadX.setValue(emitter.acceleration.spread.x);
    accelerationSpreadY.setValue(emitter.acceleration.spread.y);
    accelerationSpreadZ.setValue(emitter.acceleration.spread.z);

    color1.setValue(`#${emitter.color.value[0].getHexString()}`);
    color2.setValue(`#${emitter.color.value[1].getHexString()}`);
    color3.setValue(`#${emitter.color.value[2].getHexString()}`);
    color4.setValue(`#${emitter.color.value[3].getHexString()}`);

    size.setValue(emitter.size.value[0]);
    sizeSpread.setValue(emitter.size.spread[0]);
    texture.setValue(group.texture);
    particleCount.setValue(emitter.particleCount);
    maxAge.setValue(emitter.maxAge.value);
    maxAgeSpread.setValue(emitter.maxAge.spread);

    if (this.isPlaying) {
        btnPreview.setText(L_CANCEL);
    } else {
        btnPreview.setText(L_PREVIEW);
    }
};

ParticleEmitterComponent.prototype.onChangePosition = function () {
    var positionX = UI.get('positionX', this.id);
    var positionY = UI.get('positionY', this.id);
    var positionZ = UI.get('positionZ', this.id);

    var positionSpreadX = UI.get('positionSpreadX', this.id);
    var positionSpreadY = UI.get('positionSpreadY', this.id);
    var positionSpreadZ = UI.get('positionSpreadZ', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.position.value.x = positionX.getValue();
    emitter.position.value.y = positionY.getValue();
    emitter.position.value.z = positionZ.getValue();

    emitter.position.spread.x = positionSpreadX.getValue();
    emitter.position.spread.y = positionSpreadY.getValue();
    emitter.position.spread.z = positionSpreadZ.getValue();

    emitter.updateFlags.position = true;
};

ParticleEmitterComponent.prototype.onChangeVelocity = function () {
    var velocityX = UI.get('velocityX', this.id);
    var velocityY = UI.get('velocityY', this.id);
    var velocityZ = UI.get('velocityZ', this.id);

    var velocitySpreadX = UI.get('velocitySpreadX', this.id);
    var velocitySpreadY = UI.get('velocitySpreadY', this.id);
    var velocitySpreadZ = UI.get('velocitySpreadZ', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.velocity.value.x = velocityX.getValue();
    emitter.velocity.value.y = velocityY.getValue();
    emitter.velocity.value.z = velocityZ.getValue();

    emitter.velocity.spread.x = velocitySpreadX.getValue();
    emitter.velocity.spread.y = velocitySpreadY.getValue();
    emitter.velocity.spread.z = velocitySpreadZ.getValue();

    emitter.updateFlags.velocity = true;
};

ParticleEmitterComponent.prototype.onChangeAcceleration = function () {
    var accelerationX = UI.get('accelerationX', this.id);
    var accelerationY = UI.get('accelerationY', this.id);
    var accelerationZ = UI.get('accelerationZ', this.id);

    var accelerationSpreadX = UI.get('accelerationSpreadX', this.id);
    var accelerationSpreadY = UI.get('accelerationSpreadY', this.id);
    var accelerationSpreadZ = UI.get('accelerationSpreadZ', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.acceleration.value.x = accelerationX.getValue();
    emitter.acceleration.value.y = accelerationY.getValue();
    emitter.acceleration.value.z = accelerationZ.getValue();

    emitter.acceleration.spread.x = accelerationSpreadX.getValue();
    emitter.acceleration.spread.y = accelerationSpreadY.getValue();
    emitter.acceleration.spread.z = accelerationSpreadZ.getValue();

    emitter.updateFlags.acceleration = true;
};

ParticleEmitterComponent.prototype.onChangeColor = function () {
    var color1 = UI.get('color1', this.id);
    var color2 = UI.get('color2', this.id);
    var color3 = UI.get('color3', this.id);
    var color4 = UI.get('color4', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.color.value[0] = new THREE.Color(color1.getHexValue());
    emitter.color.value[1] = new THREE.Color(color2.getHexValue());
    emitter.color.value[2] = new THREE.Color(color3.getHexValue());
    emitter.color.value[3] = new THREE.Color(color4.getHexValue());

    emitter.updateFlags.color = true;
};

ParticleEmitterComponent.prototype.onChangeSize = function () {
    var size = UI.get('size', this.id);
    var sizeSpread = UI.get('sizeSpread', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    for (var i = 0; i < emitter.size.value.length; i++) {
        emitter.size.value[i] = size.getValue();
        emitter.size.spread[i] = sizeSpread.getValue();
    }

    emitter.updateFlags.size = true;
};

ParticleEmitterComponent.prototype.onChangeTexture = function () {
    var texture = UI.get('texture', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    texture = texture.getValue();
    texture.needsUpdate = true;

    group.texture = texture;
    group.material.uniforms.texture.value = texture;
};

ParticleEmitterComponent.prototype.onChangeParticleCount = function () {
    var particleCount = UI.get('particleCount', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.particleCount = particleCount.getValue();

    emitter.updateFlags.params = true;
};

ParticleEmitterComponent.prototype.onChangeMaxAge = function () {
    var maxAge = UI.get('maxAge', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.maxAge.value = maxAge.getValue();

    emitter.updateFlags.params = true;
};

ParticleEmitterComponent.prototype.onChangeMaxAgeSpread = function () {
    var maxAgeSpread = UI.get('maxAgeSpread', this.id);

    var group = this.selected.userData.group;
    var emitter = group.emitters[0];

    emitter.maxAge.spread = maxAgeSpread.getValue();

    emitter.updateFlags.params = true;
};

ParticleEmitterComponent.prototype.onPreview = function () {
    if (this.isPlaying) {
        this.stopPreview();
    } else {
        this.startPreview();
    }
};

ParticleEmitterComponent.prototype.startPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = true;
    btnPreview.setText(L_CANCEL);

    app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

ParticleEmitterComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText(L_PREVIEW);

    var group = this.selected.userData.group;
    var emitter = this.selected.userData.emitter;

    group.removeEmitter(emitter);
    group.addEmitter(emitter);
    group.tick(0);

    app.on(`animate.${this.id}`, null);
};

ParticleEmitterComponent.prototype.onAnimate = function (clock, deltaTime) {
    var group = this.selected.userData.group;
    group.tick(deltaTime);
};

export default ParticleEmitterComponent;