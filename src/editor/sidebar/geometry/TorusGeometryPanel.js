import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 花托几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function TorusGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

TorusGeometryPanel.prototype = Object.create(UI.Control.prototype);
TorusGeometryPanel.prototype.constructor = TorusGeometryPanel;

TorusGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var radius = UI.get('torusGeometryRadius');
        var tube = UI.get('torusGeometryTube');
        var radialSegments = UI.get('torusGeometryRadialSegments');
        var tubularSegments = UI.get('torusGeometryTubularSegments');
        var arc = UI.get('torusGeometryTubularArc');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            tube.getValue(),
            radialSegments.getValue(),
            tubularSegments.getValue(),
            arc.getValue()
        )));
    };

    this.children = [{
        xtype: 'row',
        parent: this.parent,
        children: [{
            xtype: 'row',
            children: [{ // radius
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'torusGeometryRadius',
                value: parameters.radius,
                onChange: update
            }]
        }, { // tube
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '管粗'
            }, {
                xtype: 'number',
                id: 'torusGeometryTube',
                value: parameters.tube,
                onChange: update
            }]
        }, { // radialSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '管粗段数'
            }, {
                xtype: 'int',
                id: 'torusGeometryRadialSegments',
                value: parameters.radialSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // tubularSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径段数'
            }, {
                xtype: 'int',
                id: 'torusGeometryTubularSegments',
                value: parameters.tubularSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // radialSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径段数'
            }, {
                xtype: 'int',
                id: 'torusGeometryRadialSegments',
                value: parameters.tubularSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // arc
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '旋转弧度'
            }, {
                xtype: 'number',
                id: 'torusGeometryTubularArc',
                value: parameters.arc,
                onChange: update
            }]
        }]
    }];

    var container = UI.create(this.children[0]);
    container.render();
};

export default TorusGeometryPanel;
