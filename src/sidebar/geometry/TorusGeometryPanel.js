import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * 花托几何体
 * @author mrdoob / http://mrdoob.com/
 */
function TorusGeometryPanel(editor, object) {
    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radius

    var radiusRow = new UI.Row();
    var radius = new UI.Number({
        value: parameters.radius,
        onChange: update
    });

    radiusRow.add(new UI.Text({
        text: '半径',
        style: 'width: 90px;'
    }));

    radiusRow.add(radius);

    container.add(radiusRow);

    // tube

    var tubeRow = new UI.Row();

    var tube = new UI.Number({
        value: parameters.tube,
        onChange: update
    });

    tubeRow.add(new UI.Text({
        text: '管长',
        style: 'width: 90px;'
    }));

    tubeRow.add(tube);

    container.add(tubeRow);

    // radialSegments

    var radialSegmentsRow = new UI.Row();

    var radialSegments = new UI.Integer({
        value: parameters.radialSegments,
        range: [1, Infinity],
        onChange: update
    });

    radialSegmentsRow.add(new UI.Text({
        text: '径向段数',
        style: 'width: 90px;'
    }));

    radialSegmentsRow.add(radialSegments);

    container.add(radialSegmentsRow);

    // tubularSegments

    var tubularSegmentsRow = new UI.Row();

    var tubularSegments = new UI.Integer({
        value: parameters.tubularSegments,
        range: [1, Infinity],
        onChange: update
    });

    tubularSegmentsRow.add(new UI.Text({
        text: '管长段数',
        style: 'width: 90px;'
    }));

    tubularSegmentsRow.add(tubularSegments);

    container.add(tubularSegmentsRow);

    // arc

    var arcRow = new UI.Row();
    var arc = new UI.Number({
        value: parameters.arc,
        onChange: update
    });

    arcRow.add(new UI.Text({
        text: '弧长',
        style: 'width: 90px;'
    }));

    arcRow.add(arc);

    container.add(arcRow);

    //
    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            tube.getValue(),
            radialSegments.getValue(),
            tubularSegments.getValue(),
            arc.getValue()
        )));

    }

    container.render();

    return container;
};

export default TorusGeometryPanel;
