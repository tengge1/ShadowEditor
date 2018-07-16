import Control from '../../ui/Control';
import XType from '../../ui/XType';
import ObjectPanel from './ObjectPanel';
import GeometryPanel from './geometry/GeometryPanel';
import MaterialPanel from './MaterialPanel';

/**
 * 属性面板
 * @author mrdoob / http://mrdoob.com/
 */
function PropertyPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

PropertyPanel.prototype = Object.create(Control.prototype);
PropertyPanel.prototype.constructor = PropertyPanel;

PropertyPanel.prototype.render = function () {
    var editor = this.app.editor;

    var onClick = function (event) {
        select(event.target.textContent);
    };

    var data = {
        xtype: 'div',
        id: 'propertyPanel',
        parent: this.parent,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                text: '物体',
                onClick: onClick
            }, {
                xtype: 'text',
                text: '几何',
                onClick: onClick
            }, {
                xtype: 'text',
                text: '材质',
                onClick: onClick
            }]
        }, {
            xtype: 'div',
            children: [
                
            ]
        }]
    };

    var control = XType.create(data);
    control.render();

    var object = new UI.Div();

    object.render();

    var objectPanel = new ObjectPanel({ app: this.app, parent: object.dom });
    objectPanel.render();

    container.dom.appendChild(object.dom);

    var geometry = new UI.Div();
    geometry.render();

    var geometryPanel = new GeometryPanel(editor);

    geometry.dom.appendChild(geometryPanel.dom);

    container.dom.appendChild(geometry.dom);

    var material = new UI.Div();

    material.render();

    var materialPanel = new MaterialPanel({ app: this.app, parent: material.dom });
    materialPanel.render();

    container.dom.appendChild(material.dom);

    //

    function select(section) {

        objectTab.dom.className = '';
        geometryTab.dom.className = '';
        materialTab.dom.className = '';

        object.dom.style.display = 'none';
        geometry.dom.style.display = 'none';
        material.dom.style.display = 'none';

        switch (section) {
            case '物体':
                objectTab.dom.className = 'selected';
                object.dom.style.display = '';
                break;
            case '几何':
                geometryTab.dom.className = 'selected';
                geometry.dom.style.display = '';
                break;
            case '材质':
                materialTab.dom.className = 'selected';
                material.dom.style.display = '';
                break;
        }
    }

    select('物体');
};

export default PropertyPanel;