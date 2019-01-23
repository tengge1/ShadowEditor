import BaseComponent from '../BaseComponent';

/**
 * 指针锁定控制器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PointerLockControlComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PointerLockControlComponent.prototype = Object.create(BaseComponent.prototype);
PointerLockControlComponent.prototype.constructor = PointerLockControlComponent;

PointerLockControlComponent.prototype.render = function () {
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
                text: L_POINTER_LOCK_CONTROLS
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_IS_LOCKED
            }, {
                xtype: 'checkbox',
                id: 'isLocked',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PointerLockControlComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PointerLockControlComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PointerLockControlComponent.prototype.updateUI = function () {
    var container = UI.get('controlPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected === this.app.editor.camera && editor.selected.userData.control === 'PointerLockControls') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var isLocked = UI.get('isLocked', this.id);

    var options = this.selected.userData.pointerLockOptions || {
        isLocked: true,
    };

    if (this.selected.userData.pointerLockOptions === undefined) {
        this.selected.userData.pointerLockOptions = {};
        Object.assign(this.selected.userData.pointerLockOptions, options);
    }

    isLocked.setValue(options.isLocked);
};

PointerLockControlComponent.prototype.onChange = function () {
    var isLocked = UI.get('isLocked', this.id);

    Object.assign(this.selected.userData.pointerLockOptions, {
        isLocked: isLocked.getValue(),
    });
};

export default PointerLockControlComponent;