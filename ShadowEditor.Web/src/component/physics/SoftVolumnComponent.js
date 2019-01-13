import BaseComponent from '../BaseComponent';

/**
 * 柔软体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SoftVolumnComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SoftVolumnComponent.prototype = Object.create(BaseComponent.prototype);
SoftVolumnComponent.prototype.constructor = SoftVolumnComponent;

SoftVolumnComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'panel',
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
                    width: '100%',
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '柔软体'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '启用'
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
                text: '质量'
            }, {
                xtype: 'number',
                id: 'mass',
                scope: this.id,
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '压力'
            }, {
                xtype: 'number',
                id: 'pressure',
                scope: this.id,
                style: {
                    width: '100px',
                    fontSize: '12px'
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

SoftVolumnComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SoftVolumnComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SoftVolumnComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;

    return;

    if (editor.selected && editor.selected.userData.physics) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var shape = UI.get('shape', this.id);
    var mass = UI.get('mass', this.id);
    var inertiaX = UI.get('inertiaX', this.id);
    var inertiaY = UI.get('inertiaY', this.id);
    var inertiaZ = UI.get('inertiaZ', this.id);

    var physics = this.selected.userData.physics;

    enabled.setValue(physics.enabled);
    shape.setValue(physics.shape);
    mass.setValue(physics.mass);
    inertiaX.setValue(physics.inertia.x);
    inertiaY.setValue(physics.inertia.y);
    inertiaZ.setValue(physics.inertia.z);
};

SoftVolumnComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var shape = UI.get('shape', this.id);
    var mass = UI.get('mass', this.id);
    var inertiaX = UI.get('inertiaX', this.id);
    var inertiaY = UI.get('inertiaY', this.id);
    var inertiaZ = UI.get('inertiaZ', this.id);

    var physics = this.selected.userData.physics;

    physics.enabled = enabled.getValue();
    physics.shape = shape.getValue();
    physics.mass = mass.getValue();
    physics.inertia.x = inertiaX.getValue();
    physics.inertia.y = inertiaY.getValue();
    physics.inertia.z = inertiaZ.getValue();

    this.app.call(`objectChanged`, this, this.selected);
};

export default SoftVolumnComponent;