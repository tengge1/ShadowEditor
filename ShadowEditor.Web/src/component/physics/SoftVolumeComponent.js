import BaseComponent from '../BaseComponent';

/**
 * 柔软体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SoftVolumeComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SoftVolumeComponent.prototype = Object.create(BaseComponent.prototype);
SoftVolumeComponent.prototype.constructor = SoftVolumeComponent;

SoftVolumeComponent.prototype.render = function () {
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

SoftVolumeComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SoftVolumeComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SoftVolumeComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;

    if (editor.selected &&
        editor.selected.userData.physics &&
        editor.selected.userData.physics.enabled &&
        editor.selected.userData.physics.type === 'softVolume'
    ) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var mass = UI.get('mass', this.id);
    var pressure = UI.get('pressure', this.id);

    var physics = this.selected.userData.physics;

    physics.mass = physics.mass || 0;
    physics.pressure = physics.pressure === undefined ? 30 : physics.pressure;

    mass.setValue(physics.mass);
    pressure.setValue(physics.pressure);
};

SoftVolumeComponent.prototype.onChange = function () {
    var mass = UI.get('mass', this.id);
    var pressure = UI.get('pressure', this.id);

    var physics = this.selected.userData.physics;

    physics.mass = mass.getValue();
    physics.pressure = pressure.getValue();

    this.app.call(`objectChanged`, this, this.selected);
};

export default SoftVolumeComponent;