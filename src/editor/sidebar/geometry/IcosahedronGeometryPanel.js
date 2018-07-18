import Control from '../../../ui/Control';
import XType from '../../../ui/XType';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 二十面体几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function IcosahedronGeometryPanel(options) {
    Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

IcosahedronGeometryPanel.prototype = Object.create(Control.prototype);
IcosahedronGeometryPanel.prototype.constructor = IcosahedronGeometryPanel;

IcosahedronGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;
    var _this = this;

    var update = function () {
        var radius = XType.getControl('icosahedronGeometryRadius');
        var detail = XType.getControl('icosahedronGeometryDetail');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            detail.getValue()
        )));

        _this.app.call('objectChanged', _this, object);
    };

    var data = {
        xtype: 'row',
        parent: this.parent,
        children: [{ // radius
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'icosahedronGeometryRadius',
                value: parameters.radius,
                onChange: update
            }]
        }, { // detail
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '面片段数'
            }, {
                xtype: 'int',
                id: 'icosahedronGeometryDetail',
                value: parameters.detail,
                range: [0, Infinity],
                onChange: update
            }]
        }]
    };

    var container = XType.create(data);
    container.render();
};

export default IcosahedronGeometryPanel;
