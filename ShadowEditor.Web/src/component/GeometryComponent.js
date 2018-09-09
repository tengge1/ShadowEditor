import BaseComponent from './BaseComponent';
import PlaneGeometryComponent from './geometry/PlaneGeometryComponent';

/**
 * 几何体组件
 * @param {*} options 
 */
function GeometryComponent(options) {
    BaseComponent.call(this, options);
}

GeometryComponent.prototype = Object.create(BaseComponent.prototype);
GeometryComponent.prototype.constructor = GeometryComponent;

GeometryComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'geometryPanel',
        scope: this.id,
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
                text: '几何组件'
            }]
        },
        new PlaneGeometryComponent({ app: this.app })
        ]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
};

GeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

GeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
    }
};

export default GeometryComponent;