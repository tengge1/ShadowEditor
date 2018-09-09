import BaseComponent from './BaseComponent';
import PlaneGeometryComponent from './geometry/PlaneGeometryComponent';
import BoxGeometryComponent from './geometry/BoxGeometryComponent';
import CircleGeometryComponent from './geometry/CircleGeometryComponent';
import CylinderGeometryComponent from './geometry/CylinderGeometryComponent';
import SphereGeometryComponent from './geometry/SphereGeometryComponent';
import IcosahedronGeometryComponent from './geometry/IcosahedronGeometryComponent';

/**
 * 几何体组件
 * @author tengge / https://github.com/tengge1
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
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'text',
                id: 'name',
                scope: this.id,
                text: ''
            }]
        },
        new PlaneGeometryComponent({ app: this.app }),
        new BoxGeometryComponent({ app: this.app }),
        new CircleGeometryComponent({ app: this.app }),
        new CylinderGeometryComponent({ app: this.app }),
        new SphereGeometryComponent({ app: this.app }),
        new IcosahedronGeometryComponent({ app: this.app })
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
        UI.get('name', this.id).setValue(editor.selected.geometry.constructor.name);
    } else {
        container.dom.style.display = 'none';
        UI.get('name', this.id).setValue('');
    }
};

export default GeometryComponent;