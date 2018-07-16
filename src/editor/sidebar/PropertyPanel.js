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
                id: 'objectTab',
                text: '物体',
                onClick: onClick
            }, {
                xtype: 'text',
                id: 'geometryTab',
                text: '几何',
                onClick: onClick
            }, {
                xtype: 'text',
                id: 'materialTab',
                text: '材质',
                onClick: onClick
            }]
        }, {
            xtype: 'div',
            children: [
                new ObjectPanel({ app: this.app, id: 'object' })
            ]
        }, {
            xtype: 'div',
            children: [
                new GeometryPanel({ app: this.app, id: 'geometry' })
            ]
        }, {
            xtype: 'div',
            children: [
                new MaterialPanel({ app: this.app, id: 'material' })
            ]
        }]
    };

    var control = XType.create(data);
    control.render();

    var objectTab = XType.getControl('objectTab');
    var geometryTab = XType.getControl('geometryTab');
    var materialTab = XType.getControl('materialTab');
    var objectPanel = XType.getControl('objectPanel');
    var geometryPanel = XType.getControl('geometryPanel');
    var materialPanel = XType.getControl('materialPanel');

    function select(section) {

        objectTab.dom.className = '';
        geometryTab.dom.className = '';
        materialTab.dom.className = '';

        objectPanel.dom.style.display = 'none';
        geometryPanel.dom.style.display = 'none';
        materialPanel.dom.style.display = 'none';

        switch (section) {
            case '物体':
                objectTab.dom.className = 'selected';
                objectPanel.dom.style.display = '';
                break;
            case '几何':
                geometryTab.dom.className = 'selected';
                geometryPanel.dom.style.display = '';
                break;
            case '材质':
                materialTab.dom.className = 'selected';
                materialPanel.dom.style.display = '';
                break;
        }
    }

    select('物体');
};

export default PropertyPanel;