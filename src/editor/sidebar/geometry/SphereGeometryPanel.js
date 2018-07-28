import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 球形几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function SphereGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

SphereGeometryPanel.prototype = Object.create(UI.Control.prototype);
SphereGeometryPanel.prototype.constructor = SphereGeometryPanel;

SphereGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var radius = UI.get('sphereGeometryRadius');
        var widthSegments = UI.get('sphereGeometryWidthSegments');
        var heightSegments = UI.get('sphereGeometryHeightSegments');
        var phiStart = UI.get('sphereGeometryPhiStart');
        var phiLength = UI.get('sphereGeometryPhiLength');
        var thetaStart = UI.get('sphereGeometryThetaStart');
        var thetaLength = UI.get('sphereGeometryThetaLength');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            widthSegments.getValue(),
            heightSegments.getValue(),
            phiStart.getValue(),
            phiLength.getValue(),
            thetaStart.getValue(),
            thetaLength.getValue()
        )));
    };

    this.children = [{
        xtype: 'row',
        children: [{ // radius
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'sphereGeometryRadius',
                value: parameters.radius,
                onChange: update
            }]
        }, { // widthSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度段数'
            }, {
                xtype: 'int',
                id: 'sphereGeometryWidthSegments',
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
                id: 'sphereGeometryHeightSegments',
                value: parameters.heightSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // phiStart
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始经度'
            }, {
                xtype: 'number',
                id: 'sphereGeometryPhiStart',
                value: parameters.phiStart,
                onChange: update
            }]
        }, { // phiLength
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '结束经度'
            }, {
                xtype: 'number',
                id: 'sphereGeometryPhiLength',
                value: parameters.phiLength,
                onChange: update
            }]
        }, { // thetaStart
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始纬度'
            }, {
                xtype: 'number',
                id: 'sphereGeometryThetaStart',
                value: parameters.thetaStart,
                onChange: update
            }]
        }, { // thetaLength
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '结束纬度'
            }, {
                xtype: 'number',
                id: 'sphereGeometryThetaLength',
                value: parameters.thetaLength,
                onChange: update
            }]
        }]
    }];

    var container = UI.create(this.children[0]);
    container.render();
};

export default SphereGeometryPanel;
