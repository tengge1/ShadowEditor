import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 光源组件
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
            borderTop: 0,
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
                text: '光源组件'
            }]
        }, {
            xtype: 'row',
            id: 'objectColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '颜色'
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
                text: '强度'
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
                text: '距离'
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
                text: '角度'
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
                text: '半阴影'
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
                text: '衰变'
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
                text: '天空颜色'
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
                text: '地面颜色'
            }, {
                xtype: 'color',
                id: 'objectGroundColor',
                scope: this.id,
                onChange: this.onChangeGroundColor.bind(this)
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

};

LightComponent.prototype.onChangeColor = function () {

};

LightComponent.prototype.onChangeIntensity = function () {

};

LightComponent.prototype.onChangeDistance = function () {

};

LightComponent.prototype.onChangeAngle = function () {

};

LightComponent.prototype.onChangePenumbra = function () {

};

LightComponent.prototype.onChangeDecay = function () {

};

LightComponent.prototype.onChangeSkyColor = function () {

};

LightComponent.prototype.onChangeGroundColor = function () {

};

export default LightComponent;