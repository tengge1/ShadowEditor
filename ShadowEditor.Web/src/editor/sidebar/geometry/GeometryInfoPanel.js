import UI from '../../../ui/UI';

/**
 * 几何体信息面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function GeometryInfoPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

GeometryInfoPanel.prototype = Object.create(UI.Control.prototype);
GeometryInfoPanel.prototype.constructor = GeometryInfoPanel;

GeometryInfoPanel.prototype.render = function () {
    var editor = this.app.editor;

    this.children = {
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
        }]
    };

    var container = UI.create(this.children);
    container.render();

    function update(object) {
        var vertices = UI.get('geometryInfoVertices');
        var faces = UI.get('geometryInfoFaces');

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