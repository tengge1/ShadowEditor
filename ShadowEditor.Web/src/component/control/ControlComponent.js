import BaseComponent from '../BaseComponent';

/**
 * 控制组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ControlComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

ControlComponent.prototype = Object.create(BaseComponent.prototype);
ControlComponent.prototype.constructor = ControlComponent;

ControlComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'controlPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: '1px solid #ddd',
            display: 'none',
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
                text: L_SCENE_CONTROLLER
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TYPE
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                    '': L_NONE,
                    'FirstPersonControls': L_FIRST_PERSON_CONTROLS,
                    'FlyControls': L_FLY_CONTROLS,
                    'OrbitControls': L_ORBIT_CONTROLS,
                    'PointerLockControls': L_POINTER_LOCK_CONTROLS,
                    'TrackballControls': L_TRACEBALL_CONTROLS
                },
                onChange: this.onChangeType.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ControlComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ControlComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ControlComponent.prototype.updateUI = function () {
    var container = UI.get('controlPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected === this.app.editor.camera) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var type = UI.get('type', this.id);

    type.setValue(this.selected.userData.control);
};

ControlComponent.prototype.onChangeType = function () {
    var type = UI.get('type', this.id);

    this.selected.userData.control = type.getValue();

    this.app.call('objectChanged', this, this.selected);
};

export default ControlComponent;