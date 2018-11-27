import BaseComponent from '../BaseComponent';

/**
 * 飞行控制器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FlyControlComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

FlyControlComponent.prototype = Object.create(BaseComponent.prototype);
FlyControlComponent.prototype.constructor = FlyControlComponent;

FlyControlComponent.prototype.render = function () {
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
                text: '飞行控制器'
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
                text: '旋转速度'
            }, {
                xtype: 'number',
                id: 'rollSpeed',
                scope: this.id,
                value: 0.05,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '拖动查看'
            }, {
                xtype: 'checkbox',
                id: 'dragToLook',
                scope: this.id,
                value: false,
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
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

FlyControlComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

FlyControlComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

FlyControlComponent.prototype.updateUI = function () {
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
    var rollSpeed = UI.get('rollSpeed', this.id);
    var dragToLook = UI.get('dragToLook', this.id);
    var autoForward = UI.get('autoForward', this.id);

    var options = this.selected.userData.firstPersonOptions || {
        movementSpeed: 10.0,
        rollSpeed: 0.05,
        dragToLook: false,
        autoForward: false,
    };

    if (this.selected.userData.flyOptions === undefined) {
        this.selected.userData.flyOptions = {};
        Object.assign(this.selected.userData.flyOptions, options);
    }

    movementSpeed.setValue(options.movementSpeed);
    rollSpeed.setValue(options.rollSpeed);
    dragToLook.setValue(options.dragToLook);
    autoForward.setValue(options.autoForward);
};

FlyControlComponent.prototype.onChange = function () {
    var movementSpeed = UI.get('movementSpeed', this.id);
    var rollSpeed = UI.get('rollSpeed', this.id);
    var dragToLook = UI.get('dragToLook', this.id);
    var autoForward = UI.get('autoForward', this.id);

    Object.assign(this.selected.userData.firstPersonOptions, {
        movementSpeed: movementSpeed.getValue(),
        rollSpeed: rollSpeed.getValue(),
        dragToLook: dragToLook.getValue(),
        autoForward: autoForward.getValue(),
    });
};

export default FlyControlComponent;