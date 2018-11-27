import BaseComponent from '../BaseComponent';

/**
 * 第一视角控制器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FirstPersonControlComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

FirstPersonControlComponent.prototype = Object.create(BaseComponent.prototype);
FirstPersonControlComponent.prototype.constructor = FirstPersonControlComponent;

FirstPersonControlComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'controlPanel',
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
                text: '第一视角控制器'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'movementSpeed'
            }, {
                xtype: 'number',
                id: 'movementSpeed',
                scope: this.id,
                value: 10.0
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'lookSpeed'
            }, {
                xtype: 'number',
                id: 'lookSpeed',
                scope: this.id,
                value: 0.05
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'lookVertical'
            }, {
                xtype: 'checkbox',
                id: 'lookVertical',
                scope: this.id,
                value: true
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'autoForward'
            }, {
                xtype: 'checkbox',
                id: 'autoForward',
                scope: this.id,
                value: false
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'activeLook'
            }, {
                xtype: 'checkbox',
                id: 'activeLook',
                scope: this.id,
                value: true
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'heightSpeed'
            }, {
                xtype: 'checkbox',
                id: 'heightSpeed',
                scope: this.id,
                value: false
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'heightCoef'
            }, {
                xtype: 'number',
                id: 'heightCoef',
                scope: this.id,
                value: 1.0
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'heightMin'
            }, {
                xtype: 'number',
                id: 'heightMin',
                scope: this.id,
                value: 0.0
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'heightMax'
            }, {
                xtype: 'number',
                id: 'heightMax',
                scope: this.id,
                value: 1.0
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'constrainVertical'
            }, {
                xtype: 'checkbox',
                id: 'constrainVertical',
                scope: this.id,
                value: false
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'verticalMin'
            }, {
                xtype: 'number',
                id: 'verticalMin',
                scope: this.id,
                value: 0
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: 'verticalMax'
            }, {
                xtype: 'number',
                id: 'verticalMax',
                scope: this.id,
                value: 3.14
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

FirstPersonControlComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

FirstPersonControlComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

FirstPersonControlComponent.prototype.updateUI = function () {
    var container = UI.get('controlPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected === this.app.editor.camera && editor.selected.userData.control === 'FirstPersonControls') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var movementSpeed = UI.get('movementSpeed', this.id);
    var lookSpeed = UI.get('lookSpeed', this.id);
    var lookVertical = UI.get('lookVertical', this.id);
    var autoForward = UI.get('autoForward', this.id);
    var activeLook = UI.get('activeLook', this.id);
    var heightSpeed = UI.get('heightSpeed', this.id);
    var heightCoef = UI.get('heightCoef', this.id);
    var heightMin = UI.get('heightMin', this.id);
    var heightMax = UI.get('heightMax', this.id);
    var constrainVertical = UI.get('constrainVertical', this.id);
    var verticalMax = UI.get('verticalMax', this.id);
};

FirstPersonControlComponent.prototype.onChangeType = function () {
    var type = UI.get('type', this.id);

    this.selected.userData.control = type.getValue();
};

export default FirstPersonControlComponent;