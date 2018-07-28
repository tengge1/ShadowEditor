import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 环面纽结几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function TorusKnotGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

TorusKnotGeometryPanel.prototype = Object.create(UI.Control.prototype);
TorusKnotGeometryPanel.prototype.constructor = TorusKnotGeometryPanel;

TorusKnotGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var radius = UI.get('torusKnotGeometryRadius');
        var tube = UI.get('torusKnotGeometryTube');
        var tubularSegments = UI.get('torusKnotGeometryTubularSegments');
        var radialSegments = UI.get('torusKnotGeometryRadialSegments');
        var p = UI.get('torusKnotGeometryP');
        var q = UI.get('torusKnotGeometryQ');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            tube.getValue(),
            tubularSegments.getValue(),
            radialSegments.getValue(),
            p.getValue(),
            q.getValue()
        )));
    };

    this.children = [{
        xtype: 'row',
        parent: this.parent,
        children: [{ // radius
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'torusKnotGeometryRadius',
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
                id: 'torusKnotGeometryTube',
                value: parameters.tube,
                onChange: update
            }]
        }, { // tubularSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '管长段数'
            }, {
                xtype: 'int',
                id: 'torusKnotGeometryTubularSegments',
                value: parameters.tubularSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // radialSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '管粗段数'
            }, {
                xtype: 'int',
                id: 'torusKnotGeometryRadialSegments',
                value: parameters.radialSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // p
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '管长弧度'
            }, {
                xtype: 'number',
                id: 'torusKnotGeometryP',
                value: parameters.p,
                onChange: update
            }]
        }, { // q
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '扭曲弧度'
            }, {
                xtype: 'number',
                id: 'torusKnotGeometryQ',
                value: parameters.q,
                onChange: update
            }]
        }]
    }];

    var container = UI.create(this.children[0]);
    container.render();
};

export default TorusKnotGeometryPanel;
