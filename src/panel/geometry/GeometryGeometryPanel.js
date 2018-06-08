/**
 * @author mrdoob / http://mrdoob.com/
 */

function GeometryGeometryPanel(editor) {

    var signals = editor.signals;

    var container = new UI.Row();

    // vertices

    var verticesRow = new UI.Row();
    var vertices = new UI.Text();

    verticesRow.add(new UI.Text('顶点').setWidth('90px'));
    verticesRow.add(vertices);

    container.add(verticesRow);

    // faces

    var facesRow = new UI.Row();
    var faces = new UI.Text();

    facesRow.add(new UI.Text('面').setWidth('90px'));
    facesRow.add(faces);

    container.add(facesRow);

    //

    function update(object) {

        if (object === null) return; // objectSelected.dispatch( null )
        if (object === undefined) return;

        var geometry = object.geometry;

        if (geometry instanceof THREE.Geometry) {

            container.setDisplay('block');

            vertices.setValue((geometry.vertices.length).format());
            faces.setValue((geometry.faces.length).format());

        } else {

            container.setDisplay('none');

        }

    }

    signals.objectSelected.add(update);
    signals.geometryChanged.add(update);

    return container;

};

export default GeometryGeometryPanel;