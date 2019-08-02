import BaseComponent from './BaseComponent';
import PlaneGeometryComponent from './geometry/PlaneGeometryComponent';
import BoxGeometryComponent from './geometry/BoxGeometryComponent';
import CircleGeometryComponent from './geometry/CircleGeometryComponent';
import CylinderGeometryComponent from './geometry/CylinderGeometryComponent';
import SphereGeometryComponent from './geometry/SphereGeometryComponent';
import IcosahedronGeometryComponent from './geometry/IcosahedronGeometryComponent';
import TorusGeometryComponent from './geometry/TorusGeometryComponent';
import TorusKnotGeometryComponent from './geometry/TorusKnotGeometryComponent';
import LatheGeometryComponent from './geometry/LatheGeometryComponent';
import TeapotGeometryComponent from './geometry/TeapotGeometryComponent';

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
                text: L_GEOMETRY_COMPONENT
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TYPE
            }, {
                xtype: 'text',
                id: 'name',
                scope: this.id,
                text: ''
            }]
        },
        new PlaneGeometryComponent({ app: app }),
        new BoxGeometryComponent({ app: app }),
        new CircleGeometryComponent({ app: app }),
        new CylinderGeometryComponent({ app: app }),
        new SphereGeometryComponent({ app: app }),
        new IcosahedronGeometryComponent({ app: app }),
        new TorusGeometryComponent({ app: app }),
        new TorusKnotGeometryComponent({ app: app }),
        new LatheGeometryComponent({ app: app }),
        new TeapotGeometryComponent({ app: app })
        ]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
};

GeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

GeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = app.editor;

    var name = UI.get('name', this.id);

    if (editor.selected && editor.selected instanceof THREE.Mesh) {
        container.dom.style.display = '';
        if (editor.selected.geometry instanceof THREE.TeapotBufferGeometry) {
            name.setValue('TeapotBufferGeometry');
        } else {
            name.setValue(editor.selected.geometry.constructor.name);
        }
    } else {
        container.dom.style.display = 'none';
        name.setValue('');
    }
};

export default GeometryComponent;