import BaseComponent from '../BaseComponent';

/**
 * 物理环境组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PhysicsTypeComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PhysicsTypeComponent.prototype = Object.create(BaseComponent.prototype);
PhysicsTypeComponent.prototype.constructor = PhysicsTypeComponent;

PhysicsTypeComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'objectPanel',
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
                text: L_PHYSICS_TYPE
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLED
            }, {
                xtype: 'checkbox',
                id: 'enabled',
                scope: this.id,
                onChange: this.onChange.bind(this)
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
                    rigidBody: L_RIGID_BODY,
                    softVolume: L_SOFT_VOLUME
                },
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PhysicsTypeComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PhysicsTypeComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PhysicsTypeComponent.prototype.updateUI = function () {
    var container = UI.get('objectPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData && editor.selected.userData.physics) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var type = UI.get('type', this.id);

    var physics = this.selected.userData.physics;

    physics.enabled = physics.enabled || false;
    physics.type = physics.type || 'rigidBody';

    enabled.setValue(physics.enabled);
    type.setValue(physics.type);
};

PhysicsTypeComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var type = UI.get('type', this.id);

    var physics = this.selected.userData.physics;

    physics.enabled = enabled.getValue();
    physics.type = type.getValue();

    this.app.call(`objectChanged`, this, this.selected);
};

export default PhysicsTypeComponent;