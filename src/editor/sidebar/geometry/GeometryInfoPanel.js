import UI from '../../../ui/UI';

/**
 * 几何体信息面板
 * @author mrdoob / http://mrdoob.com/
 */
function GeometryInfoPanel(editor) {
    this.app = editor.app;

    var container = new UI.Row();

    // vertices

    var verticesRow = new UI.Row();

    verticesRow.add(new UI.Text({
        text: '顶点',
        style: 'width: 90px;'
    }));

    var vertices = new UI.Text();

    verticesRow.add(vertices);

    container.add(verticesRow);

    // faces

    var facesRow = new UI.Row();

    facesRow.add(new UI.Text({
        text: '面',
        style: 'width: 90px;'
    }));

    var faces = new UI.Text();

    facesRow.add(faces);

    container.add(facesRow);

    //

    function update(object) {
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

    container.render();

    return container;

};

export default GeometryInfoPanel;