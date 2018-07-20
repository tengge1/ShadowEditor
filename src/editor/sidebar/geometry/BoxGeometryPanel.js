import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 正方体几何体
 * @author mrdoob / http://mrdoob.com/
 */
function BoxGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

BoxGeometryPanel.prototype = Object.create(UI.Control.prototype);
BoxGeometryPanel.prototype.constructor = BoxGeometryPanel;

BoxGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var boxWidth = UI.get('boxWidth');
        var boxHeight = UI.get('boxHeight');
        var boxDepth = UI.get('boxDepth');
        var boxWidthSegments = UI.get('boxWidthSegments');
        var boxHeightSegments = UI.get('boxHeightSegments');
        var boxDepthSegments = UI.get('boxDepthSegments');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            boxWidth.getValue(),
            boxHeight.getValue(),
            boxDepth.getValue(),
            boxWidthSegments.getValue(),
            boxHeightSegments.getValue(),
            boxDepthSegments.getValue()
        )));
    };

    var data = {
        xtype: 'row',
        id: 'boxGeometryPanel',
        parent: this.parent,
        children: [{ // width
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度'
            }, {
                xtype: 'number',
                id: 'boxWidth',
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
                id: 'boxHeight',
                value: parameters.height,
                onChange: update
            }]
        }, { // depth
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '深度'
            }, {
                xtype: 'number',
                id: 'boxDepth',
                value: parameters.depth,
                onChange: update
            }]
        }, { // widthSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度段数'
            }, {
                xtype: 'int',
                id: 'boxWidthSegments',
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
                id: 'boxHeightSegments',
                value: parameters.heightSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // depthSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '深度段数'
            }, {
                xtype: 'int',
                id: 'boxDepthSegments',
                value: parameters.depthSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default BoxGeometryPanel;