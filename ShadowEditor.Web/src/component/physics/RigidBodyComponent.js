import BaseComponent from '../BaseComponent';

/**
 * 刚体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function RigidBodyComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

RigidBodyComponent.prototype = Object.create(BaseComponent.prototype);
RigidBodyComponent.prototype.constructor = RigidBodyComponent;

RigidBodyComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'rigidBodyPanel',
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
                text: '刚体'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '形状'
            }, {
                xtype: 'input',
                id: 'shape',
                scope: this.id,
                disabled: true,
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
                text: '惯性'
            }, {
                xtype: 'number',
                id: 'inertiaX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'inertiaY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'inertiaZ',
                scope: this.id,
                style: {
                    width: '40px'
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

RigidBodyComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

RigidBodyComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

RigidBodyComponent.prototype.updateUI = function () {
    var container = UI.get('rigidBodyPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.userData.physics) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

};

RigidBodyComponent.prototype.onChange = function () {

};

export default RigidBodyComponent;