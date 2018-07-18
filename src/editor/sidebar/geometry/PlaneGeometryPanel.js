import Control from '../../../ui/Control';
import XType from '../../../ui/XType';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 平板几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function PlaneGeometryPanel(options) {
    Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

PlaneGeometryPanel.prototype = Object.create(Control.prototype);
PlaneGeometryPanel.prototype.constructor = PlaneGeometryPanel;

PlaneGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var width = XType.getControl('planeGeometryWidth');
        var height = XType.getControl('planeGeometryHeight');
        var widthSegments = XType.getControl('planeGeometryWidthSegments');
        var heightSegments = XType.getControl('planeGeometryHeightSegments');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            width.getValue(),
            height.getValue(),
            widthSegments.getValue(),
            heightSegments.getValue()
        )));
    };

    var data = {
        xtype: 'row',
        parent: this.parent,
        children: [{ // width
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度'
            }, {
                xtype: 'number',
                id: 'planeGeometryWidth',
                value: parameters.width,
                onChange: update
            }]
        }, { // height
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度'
            }, {
                xtype: 'number',
                id: 'planeGeometryHeight',
                value: parameters.height,
                onChange: update
            }]
        }, { // widthSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度段数'
            }, {
                xtype: 'int',
                id: 'planeGeometryWidthSegments',
                value: parameters.widthSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // heightSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度段数'
            }, {
                xtype: 'int',
                id: 'planeGeometryHeightSegments',
                value: parameters.heightSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }]
    };

    var container = XType.create(data);
    container.render();
};

export default PlaneGeometryPanel;
