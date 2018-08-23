import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 圆柱体
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function CylinderGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

CylinderGeometryPanel.prototype = Object.create(UI.Control.prototype);
CylinderGeometryPanel.prototype.constructor = CylinderGeometryPanel;

CylinderGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;

    var update = function () {
        var radiusTop = UI.get('cylinderGeometryRadiusTop');
        var radiusBottom = UI.get('cylinderGeometryRadiusBottom');
        var height = UI.get('cylinderGeometryHeight');
        var radialSegments = UI.get('cylinderGeometryRadialSegments');
        var heightSegments = UI.get('cylinderGeometryHeightSegments');
        var openEnded = UI.get('cylinderGeometryOpenEnded');

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radiusTop.getValue(),
            radiusBottom.getValue(),
            height.getValue(),
            radialSegments.getValue(),
            heightSegments.getValue(),
            openEnded.getValue()
        )));
    };

    this.children = [{ // radiusTop
        xtype: 'row',
        parent: this.parent,
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
    }];

    var container = UI.create(this.children[0]);
    container.render();
};

export default CylinderGeometryPanel;
