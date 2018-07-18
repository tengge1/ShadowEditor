import Control from '../../../ui/Control';
import XType from '../../../ui/XType';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 圆柱体
 * @author mrdoob / http://mrdoob.com/
 */
function CylinderGeometryPanel(options) {
    Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

CylinderGeometryPanel.prototype = Object.create(Control.prototype);
CylinderGeometryPanel.prototype.constructor = CylinderGeometryPanel;

CylinderGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var radiusTop = XType.getControl('cylinderGeometryRadiusTop');
        var radiusBottom = XType.getControl('cylinderGeometryRadiusBottom');
        var height = XType.getControl('cylinderGeometryHeight');
        var radialSegments = XType.getControl('cylinderGeometryRadialSegments');
        var heightSegments = XType.getControl('cylinderGeometryHeightSegments');
        var openEnded = XType.getControl('cylinderGeometryOpenEnded');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radiusTop.getValue(),
            radiusBottom.getValue(),
            height.getValue(),
            radialSegments.getValue(),
            heightSegments.getValue(),
            openEnded.getValue()
        )));
    };

    var container = XType.create({ // radiusTop
        xtype: 'row',
        children: [{ // radiusTop
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '顶部半径'
            }, {
                xtype: 'number',
                id: 'cylinderGeometryRadiusTop',
                value: parameters.radiusTop,
                onChange: update
            }]
        }, { // radiusBottom
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '底部半径'
            }, {
                xtype: 'number',
                id: 'cylinderGeometryRadiusBottom',
                value: parameters.radiusBottom,
                onChange: update
            }]
        }, { // height
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度'
            }, {
                xtype: 'number',
                id: 'cylinderGeometryHeight',
                value: parameters.height,
                onChange: update
            }]
        }, { // radialSegments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '两端段数'
            }, {
                xtype: 'int',
                id: 'cylinderGeometryRadialSegments',
                value: parameters.radialSegments,
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
                id: 'cylinderGeometryHeightSegments',
                value: parameters.heightSegments,
                range: [1, Infinity],
                onChange: update
            }]
        }, { // openEnded
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '两端开口'
            }, {
                xtype: 'checkbox',
                id: 'cylinderGeometryOpenEnded',
                value: parameters.openEnded,
                onChange: update
            }]
        }]
    });

    container.render();
};

export default CylinderGeometryPanel;
