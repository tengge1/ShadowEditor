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
            text: '粒子发射器'
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '位置'
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
                text: '位置发散'
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
                text: '速度'
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
                text: '速度发散'
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
                text: '加速度'
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
                text: '加速度发散'
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
                text: '颜色1'
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
                text: '颜色2'
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
                text: '颜色3'
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
                text: '颜色4'
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
                text: '尺寸'
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
                text: '尺寸发散'
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
                text: '纹理'
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
                text: '粒子数量'
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
                text: '持续时长'
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
                text: '持续时长发散'
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
                text: '预览',
                onClick: this.onPreview.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ParticleEmitterComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ParticleEmitterComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ParticleEmitterComponent.prototype.updateUI = function () {
    var container = UI.get('particleEmitterPanel', this.id);
    var editor = this.app.editor;
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

    var group = this.selected.userData.obj;
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
};

ParticleEmitterComponent.prototype.onChangePosition = function () {
    var positionX = UI.get('positionX', this.id);
    var positionY = UI.get('positionY', this.id);
    var positionZ = UI.get('positionZ', this.id);

    var positionSpreadX = UI.get('positionSpreadX', this.id);
    var positionSpreadY = UI.get('positionSpreadY', this.id);
    var positionSpreadZ = UI.get('positionSpreadZ', this.id);

    var group = this.selected.userData.obj;
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

    var group = this.selected.userData.obj;
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

    var group = this.selected.userData.obj;
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

    var group = this.selected.userData.obj;
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

    var group = this.selected.userData.obj;
    var emitter = group.emitters[0];

    for (var i = 0; i < emitter.size.value.length; i++) {
        emitter.size.value[i] = size.getValue();
        emitter.size.spread[i] = sizeSpread.getValue();
    }

    emitter.updateFlags.size = true;
};

ParticleEmitterComponent.prototype.onChangeTexture = function () {
    var texture = UI.get('texture', this.id);

    var group = this.selected.userData.obj;
    var emitter = group.emitters[0];

    group.texture = texture.getValue();
    group.texture.needsUpdate = true;
};

ParticleEmitterComponent.prototype.onChangeParticleCount = function () {
    var particleCount = UI.get('particleCount', this.id);

    var group = this.selected.userData.obj;
    var emitter = group.emitters[0];

    emitter.particleCount = particleCount.getValue();

    emitter.updateFlags.params = true;
};

ParticleEmitterComponent.prototype.onChangeMaxAge = function () {
    var maxAge = UI.get('maxAge', this.id);

    var group = this.selected.userData.obj;
    var emitter = group.emitters[0];

    emitter.maxAge.value = maxAge.getValue();

    emitter.updateFlags.params = true;
};

ParticleEmitterComponent.prototype.onChangeMaxAgeSpread = function () {
    var maxAgeSpread = UI.get('maxAgeSpread', this.id);

    var group = this.selected.userData.obj;
    var emitter = group.emitters[0];

    emitter.maxAge.spread = maxAgeSpread.getValue();

    emitter.updateFlags.params = true;
};

ParticleEmitterComponent.prototype.onPreview = function () {

};

export default ParticleEmitterComponent;