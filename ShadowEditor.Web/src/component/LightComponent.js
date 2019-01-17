import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 光源组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function LightComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

LightComponent.prototype = Object.create(BaseComponent.prototype);
LightComponent.prototype.constructor = LightComponent;

LightComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'lightPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: L_LIGHT_COMPONENT
            }]
        }, {
            xtype: 'row',
            id: 'objectColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_COLOR
            }, {
                xtype: 'color',
                id: 'objectColor',
                scope: this.id,
                onChange: this.onChangeColor.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectIntensityRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_INTENSITY
            }, {
                xtype: 'number',
                id: 'objectIntensity',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChangeIntensity.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectDistanceRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_DISTANCE
            }, {
                xtype: 'number',
                id: 'objectDistance',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChangeDistance.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectAngleRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_ANGLE
            }, {
                xtype: 'number',
                id: 'objectAngle',
                scope: this.id,
                precision: 3,
                range: [0, Math.PI / 2],
                onChange: this.onChangeAngle.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectPenumbraRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_PENUMBRA
            }, {
                xtype: 'number',
                id: 'objectPenumbra',
                scope: this.id,
                range: [0, 1],
                onChange: this.onChangePenumbra.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectDecayRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_DECAY
            }, {
                xtype: 'number',
                id: 'objectDecay',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChangeDecay.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectSkyColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_SKY_COLOR
            }, {
                xtype: 'color',
                id: 'objectSkyColor',
                scope: this.id,
                onChange: this.onChangeSkyColor.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectGroundColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_GROUND_COLOR
            }, {
                xtype: 'color',
                id: 'objectGroundColor',
                scope: this.id,
                onChange: this.onChangeGroundColor.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectWidthRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_WIDTH
            }, {
                xtype: 'number',
                id: 'objectWidth',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChangeWidth.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectHeightRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_HEIGHT
            }, {
                xtype: 'number',
                id: 'objectHeight',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChangeHeight.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

LightComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

LightComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

LightComponent.prototype.updateUI = function () {
    var container = UI.get('lightPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Light) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var objectColorRow = UI.get('objectColorRow', this.id);
    var objectIntensityRow = UI.get('objectIntensityRow', this.id);
    var objectDistanceRow = UI.get('objectDistanceRow', this.id);
    var objectAngleRow = UI.get('objectAngleRow', this.id);
    var objectPenumbraRow = UI.get('objectPenumbraRow', this.id);
    var objectDecayRow = UI.get('objectDecayRow', this.id);
    var objectSkyColorRow = UI.get('objectSkyColorRow', this.id);
    var objectGroundColorRow = UI.get('objectGroundColorRow', this.id);
    var objectWidthRow = UI.get('objectWidthRow', this.id);
    var objectHeightRow = UI.get('objectHeightRow', this.id);

    var objectColor = UI.get('objectColor', this.id);
    var objectIntensity = UI.get('objectIntensity', this.id);
    var objectDistance = UI.get('objectDistance', this.id);
    var objectAngle = UI.get('objectAngle', this.id);
    var objectPenumbra = UI.get('objectPenumbra', this.id);
    var objectDecay = UI.get('objectDecay', this.id);
    var objectSkyColor = UI.get('objectSkyColor', this.id);
    var objectGroundColor = UI.get('objectGroundColor', this.id);
    var objectWidth = UI.get('objectWidth', this.id);
    var objectHeight = UI.get('objectHeight', this.id);

    if (this.selected instanceof THREE.HemisphereLight) {
        objectColorRow.dom.style.display = 'none';
    } else {
        objectColorRow.dom.style.display = '';
        objectColor.setValue(`#${this.selected.color.getHexString()}`);
    }

    objectIntensityRow.dom.style.display = '';
    objectIntensity.setValue(this.selected.intensity);

    if (this.selected instanceof THREE.PointLight || this.selected instanceof THREE.SpotLight) {
        objectDistanceRow.dom.style.display = '';
        objectDecayRow.dom.style.display = '';
        objectDistance.setValue(this.selected.distance);
        objectDecay.setValue(this.selected.decay);
    } else {
        objectDistanceRow.dom.style.display = 'none';
        objectDecayRow.dom.style.display = 'none';
    }

    if (this.selected instanceof THREE.SpotLight) {
        objectAngleRow.dom.style.display = '';
        objectPenumbraRow.dom.style.display = '';
        objectAngle.setValue(this.selected.angle);
        objectPenumbra.setValue(this.selected.penumbra);
    } else {
        objectAngleRow.dom.style.display = 'none';
        objectPenumbraRow.dom.style.display = 'none';
    }

    if (this.selected instanceof THREE.HemisphereLight) {
        objectSkyColorRow.dom.style.display = '';
        objectGroundColorRow.dom.style.display = '';
        objectSkyColor.setValue(`#${this.selected.color.getHexString()}`);
        objectGroundColor.setValue(`#${this.selected.groundColor.getHexString()}`);
    } else {
        objectSkyColorRow.dom.style.display = 'none';
        objectGroundColorRow.dom.style.display = 'none';
    }

    if (this.selected instanceof THREE.RectAreaLight) {
        objectWidthRow.dom.style.display = '';
        objectHeightRow.dom.style.display = '';
        objectWidth.setValue(this.selected.width);
        objectHeight.setValue(this.selected.height);
    } else {
        objectWidthRow.dom.style.display = 'none';
        objectHeightRow.dom.style.display = 'none';
    }
};

LightComponent.prototype.onChangeColor = function () {
    var objectColor = UI.get('objectColor', this.id);
    this.selected.color = new THREE.Color(objectColor.getHexValue());
    var helper = this.selected.children.filter(n => n.userData.type === 'helper')[0];
    if (helper) {
        helper.material.color = this.selected.color;
    }
};

LightComponent.prototype.onChangeIntensity = function () {
    var objectIntensity = UI.get('objectIntensity', this.id);
    this.selected.intensity = objectIntensity.getValue();
};

LightComponent.prototype.onChangeDistance = function () {
    var objectDistance = UI.get('objectDistance', this.id);
    this.selected.distance = objectDistance.getValue();
};

LightComponent.prototype.onChangeAngle = function () {
    var objectAngle = UI.get('objectAngle', this.id);
    this.selected.angle = objectAngle.getValue();
};

LightComponent.prototype.onChangePenumbra = function () {
    var objectPenumbra = UI.get('objectPenumbra', this.id);
    this.selected.penumbra = objectPenumbra.getValue();
};

LightComponent.prototype.onChangeDecay = function () {
    var objectDecay = UI.get('objectDecay', this.id);
    this.selected.decay = objectDecay.getValue();
};

LightComponent.prototype.onChangeSkyColor = function () {
    var objectSkyColor = UI.get('objectSkyColor', this.id);
    this.selected.color = new THREE.Color(objectSkyColor.getHexValue());

    var sky = this.selected.children.filter(n => n.userData.type === 'sky')[0];
    if (sky) {
        sky.material.uniforms.topColor.value = this.selected.color;
    }
};

LightComponent.prototype.onChangeGroundColor = function () {
    var objectGroundColor = UI.get('objectGroundColor', this.id);
    this.selected.groundColor = new THREE.Color(objectGroundColor.getHexValue());

    var sky = this.selected.children.filter(n => n.userData.type === 'sky')[0];
    if (sky) {
        sky.material.uniforms.bottomColor.value = this.selected.groundColor;
    }
};

LightComponent.prototype.onChangeWidth = function () {
    var objectWidth = UI.get('objectWidth', this.id);
    this.selected.width = objectWidth.getValue();
};

LightComponent.prototype.onChangeHeight = function () {
    var objectHeight = UI.get('objectHeight', this.id);
    this.selected.height = objectHeight.getValue();
};

export default LightComponent;