import Control from '../../../ui/Control';
import XType from '../../../ui/XType';

/**
 * 几何体信息面板
 * @author mrdoob / http://mrdoob.com/
 */
function GeometryInfoPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

GeometryInfoPanel.prototype = Object.create(Control.prototype);
GeometryInfoPanel.prototype.constructor = GeometryInfoPanel;

GeometryInfoPanel.prototype.render = function () {
    var editor = this.app.editor;

    var data = {
        'xtype': 'row',
        parent: this.parent,
        children: [{ // vertices
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '顶点'
            }, {
                xtype: 'text',
                id: 'geometryInfoVertices'
            }]
        }, { // faces
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '面'
            }, {
                xtype: 'text',
                id: 'geometryInfoFaces',
            }]
        }, {

        }]
    };

    var container = UI.create(data);
    container.render();

    function update(object) {
        var vertices = XType.getControl('geometryInfoVertices');
        var faces = XType.getControl('geometryInfoFaces');

        if (object === null) return; // objectSelected.dispatch( null )
        if (object === undefined) return;

        var geometry = object.geometry;

        if (geometry instanceof THREE.Geometry) {
            container.dom.style.display = 'block';

            vertices.setValue((geometry.vertices.length).format());
            faces.setValue((geometry.faces.length).format());
        } else {
            container.dom.style.display = 'none';
        }
    }

    this.app.on('objectSelected.GeometryInfoPanel', function (mesh) {
        update(mesh);
    });

    this.app.on('geometryChanged.GeometryInfoPanel', function (mesh) {
        update(mesh);
    });
};

export default GeometryInfoPanel;