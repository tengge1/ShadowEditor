import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */
function GeometryGeometryPanel(editor) {
    this.app = editor.app;

    var container = new UI2.Row();

    // vertices

    var verticesRow = new UI2.Row();
    var vertices = new UI2.Text();

    verticesRow.add(new UI2.Text({
        text: '顶点',
        style: 'width: 90px;'
    }));

    verticesRow.add(vertices);

    container.add(verticesRow);

    // faces

    var facesRow = new UI2.Row();
    var faces = new UI2.Text();

    facesRow.add(new UI2.Text({
        text: '面',
        style: 'width: 90px;'
    }));

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

    this.app.on('objectSelected.GeometryGeometryPanel', function () {
        update();
    });

    this.app.on('geometryChanged.GeometryGeometryPanel', function () {
        update();
    });

    container.render();

    return container;

};

export default GeometryGeometryPanel;