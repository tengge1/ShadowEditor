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
            borderTop: '1px solid #ddd',
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold',
                    width: '100%'
                },
                text: '第一视角控制器'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '移动速度'
            }, {
                xtype: 'number',
                id: 'movementSpeed',
                scope: this.id,
                value: 10.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '观望速度'
            }, {
                xtype: 'number',
                id: 'lookSpeed',
                scope: this.id,
                value: 0.05,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '朝上看'
            }, {
                xtype: 'checkbox',
                id: 'lookVertical',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '自动前进'
            }, {
                xtype: 'checkbox',
                id: 'autoForward',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '启用观望'
            }, {
                xtype: 'checkbox',
                id: 'activeLook',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度速度'
            }, {
                xtype: 'checkbox',
                id: 'heightSpeed',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度系数'
            }, {
                xtype: 'number',
                id: 'heightCoef',
                scope: this.id,
                value: 1.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最小高度'
            }, {
                xtype: 'number',
                id: 'heightMin',
                scope: this.id,
                value: 0.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最大高度'
            }, {
                xtype: 'number',
                id: 'heightMax',
                scope: this.id,
                value: 1.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '限制仰角'
            }, {
                xtype: 'checkbox',
                id: 'constrainVertical',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最小仰角'
            }, {
                xtype: 'number',
                id: 'verticalMin',
                scope: this.id,
                value: 0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最大仰角'
            }, {
                xtype: 'number',
                id: 'verticalMax',
                scope: this.id,
                value: 3.14,
                onChange: this.onChange.bind(this)
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
    var verticalMin = UI.get('verticalMin', this.id);
    var verticalMax = UI.get('verticalMax', this.id);

    var options = this.selected.userData.firstPersonOptions || {
        movementSpeed: 10.0,
        lookSpeed: 0.05,
        lookVertical: true,
        autoForward: false,
        activeLook: true,
        heightSpeed: false,
        heightCoef: 1.0,
        heightMin: 0.0,
        heightMax: 1.0,
        constrainVertical: false,
        verticalMin: 0,
        verticalMax: 3.14,
    };

    if (this.selected.userData.firstPersonOptions === undefined) {
        this.selected.userData.firstPersonOptions = {};
        Object.assign(this.selected.userData.firstPersonOptions, options);
    }

    movementSpeed.setValue(options.movementSpeed);
    lookSpeed.setValue(options.lookSpeed);
    lookVertical.setValue(options.lookVertical);
    autoForward.setValue(options.autoForward);
    activeLook.setValue(options.activeLook);
    heightSpeed.setValue(options.heightSpeed);
    heightCoef.setValue(options.heightCoef);
    heightMin.setValue(options.heightMin);
    heightMax.setValue(options.heightMax);
    constrainVertical.setValue(options.constrainVertical);
    verticalMin.setValue(options.verticalMin);
    verticalMax.setValue(options.verticalMax);
};

FirstPersonControlComponent.prototype.onChange = function () {
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
    var verticalMin = UI.get('verticalMin', this.id);
    var verticalMax = UI.get('verticalMax', this.id);

    Object.assign(this.selected.userData.firstPersonOptions, {
        movementSpeed: movementSpeed.getValue(),
        lookSpeed: lookSpeed.getValue(),
        lookVertical: lookVertical.getValue(),
        autoForward: autoForward.getValue(),
        activeLook: activeLook.getValue(),
        heightSpeed: heightSpeed.getValue(),
        heightCoef: heightCoef.getValue(),
        heightMin: heightMin.getValue(),
        heightMax: heightMax.getValue(),
        constrainVertical: constrainVertical.getValue(),
        verticalMin: verticalMin.getValue(),
        verticalMax: verticalMax.getValue(),
    });
};

export default FirstPersonControlComponent;