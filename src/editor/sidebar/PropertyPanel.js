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

    var _this = this;

    var onClick = function (event) {
        _this.app.call('selectPropertyTab', _this, event.target.textContent);
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

    var control = UI.create(data);
    control.render();
};

export default PropertyPanel;