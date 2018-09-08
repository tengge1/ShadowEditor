import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 位移组件
 * @param {*} options 
 */
function TransformComponent(options) {
    BaseComponent.call(this, options);
}

TransformComponent.prototype = Object.create(BaseComponent.prototype);
TransformComponent.prototype.constructor = TransformComponent;

TransformComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'transformPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            paddingTop: '20px',
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    style: {
                        color: '#555',
                        fontWeight: 'bold'
                    },
                    text: '位移组件'
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '平移'
                }, {
                    xtype: 'number',
                    id: 'objectPositionX',
                    scope: this.id,
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangePositionX.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectPositionY',
                    scope: this.id,
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangePositionY.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectPositionZ',
                    scope: this.id,
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangePositionZ.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '旋转'
                }, {
                    xtype: 'number',
                    id: 'objectRotationX',
                    scope: this.id,
                    step: 10,
                    unit: '°',
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeRotationX.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectRotationY',
                    scope: this.id,
                    step: 10,
                    unit: '°',
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeRotationY.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectRotationZ',
                    scope: this.id,
                    step: 10,
                    unit: '°',
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeRotationZ.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '缩放'
                }, {
                    xtype: 'checkbox',
                    id: 'objectScaleLock',
                    scope: this.id,
                    value: true,
                    style: {
                        position: 'absolute',
                        left: '50px'
                    }
                }, {
                    xtype: 'number',
                    id: 'objectScaleX',
                    scope: this.id,
                    value: 1,
                    range: [0.01, Infinity],
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeScaleX.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectScaleY',
                    scope: this.id,
                    value: 1,
                    range: [0.01, Infinity],
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeScaleY.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectScaleZ',
                    scope: this.id,
                    value: 1,
                    range: [0.01, Infinity],
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeScaleZ.bind(this)
                }]
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

TransformComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

TransformComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

TransformComponent.prototype.updateUI = function () {
    var container = UI.get('transformPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }
};

TransformComponent.prototype.onChangePositionX = function () {

};

TransformComponent.prototype.onChangePositionY = function () {

};

TransformComponent.prototype.onChangePositionZ = function () {

};

TransformComponent.prototype.onChangeRotationX = function () {

};

TransformComponent.prototype.onChangeRotationY = function () {

};

TransformComponent.prototype.onChangeRotationZ = function () {

};

TransformComponent.prototype.onChangeScaleX = function () {

};

TransformComponent.prototype.onChangeScaleY = function () {

};

TransformComponent.prototype.onChangeScaleZ = function () {

};

export default TransformComponent;