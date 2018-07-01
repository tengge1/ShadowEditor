import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */
function GeometryGeometryPanel(editor) {
    this.app = editor.app;

    var container = new UI.Row();

    // vertices

    var verticesRow = new UI.Row();
    var vertices = new UI.Text();

    verticesRow.add(new UI.Text({
        text: '顶点',
        style: 'width: 90px;'
    }));

    verticesRow.add(vertices);

    container.add(verticesRow);

    // faces

    var facesRow = new UI.Row();
    var faces = new UI.Text();

    facesRow.add(new UI.Text({
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