import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 花托几何体
 * @author mrdoob / http://mrdoob.com/
 */
function TorusGeometryPanel(editor, object) {
    var container = new UI2.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radius

    var radiusRow = new UI2.Row();
    var radius = new UI2.Number({
        value: parameters.radius,
        onChange: update
    });

    radiusRow.add(new UI2.Text({
        text: '半径',
        style: 'width: 90px;'
    }));

    radiusRow.add(radius);

    container.add(radiusRow);

    // tube

    var tubeRow = new UI2.Row();

    var tube = new UI2.Number({
        value: parameters.tube,
        onChange: update
    });

    tubeRow.add(new UI2.Text({
        text: '管长',
        style: 'width: 90px;'
    }));

    tubeRow.add(tube);

    container.add(tubeRow);

    // radialSegments

    var radialSegmentsRow = new UI2.Row();

    var radialSegments = new UI2.Integer({
        value: parameters.radialSegments,
        range: [1, Infinity],
        onChange: update
    });

    radialSegmentsRow.add(new UI2.Text({
        text: '径向段数',
        style: 'width: 90px;'
    }));

    radialSegmentsRow.add(radialSegments);

    container.add(radialSegmentsRow);

    // tubularSegments

    var tubularSegmentsRow = new UI2.Row();

    var tubularSegments = new UI2.Integer({
        value: parameters.tubularSegments,
        range: [1, Infinity],
        onChange: update
    });

    tubularSegmentsRow.add(new UI2.Text({
        text: '管长段数',
        style: 'width: 90px;'
    }));

    tubularSegmentsRow.add(tubularSegments);

    container.add(tubularSegmentsRow);

    // arc

    var arcRow = new UI2.Row();
    var arc = new UI2.Number({
        value: parameters.arc,
        onChange: update
    });

    arcRow.add(new UI2.Text({
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
