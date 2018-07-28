import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 圆形几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function CircleGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

CircleGeometryPanel.prototype = Object.create(UI.Control.prototype);
CircleGeometryPanel.prototype.constructor = CircleGeometryPanel;

CircleGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    function update() {
        var radius = UI.get('circleGeometryRadius');
        var segments = UI.get('circleGeometrySegments');
        var thetaStart = UI.get('circleGeometryThetaStart');
        var thetaLength = UI.get('circleGeometryThetaLength');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            segments.getValue(),
            thetaStart.getValue(),
            thetaLength.getValue()
        )));

    }

    this.children = [{
        xtype: 'row',
        children: [{ // radius
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'circleGeometryRadius',
                value: parameters.radius,
                onChange: update
            }]
        }, { // segments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '段数'
            }, {
                xtype: 'int',
                id: 'circleGeometrySegments',
                value: parameters.segments,
                range: [3, Infinity],
                onChange: update
            }]
        }, { // thetaStart
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始弧度'
            }, {
                xtype: 'number',
                id: 'circleGeometryThetaStart',
                value: parameters.thetaStart,
                onChange: update
            }]
        }, { // thetaLength
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '结束弧度'
            }, {
                xtype: 'number',
                id: 'circleGeometryThetaLength',
                value: parameters.thetaLength,
                onChange: update,
                value: Math.PI * 2
            }]
        }]
    }];

    var container = UI.create(this.children[0]);
    container.render();
};

export default CircleGeometryPanel;
