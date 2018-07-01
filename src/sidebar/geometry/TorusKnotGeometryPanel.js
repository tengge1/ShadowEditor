import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 环面纽结几何体
 * @author mrdoob / http://mrdoob.com/
 */
function TorusKnotGeometryPanel(editor, object) {
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

    // p

    var pRow = new UI2.Row();

    var p = new UI2.Number({
        value: parameters.p,
        onChange: update
    });

    pRow.add(new UI2.Text({
        text: 'P',
        style: 'width: 90px;'
    }));

    pRow.add(p);

    container.add(pRow);

    // q

    var qRow = new UI2.Row();

    var q = new UI2.Number({
        value: parameters.q,
        onChange: update
    });

    pRow.add(new UI2.Text({
        text: 'Q',
        style: 'width: 90px;'
    }));

    pRow.add(q);

    container.add(qRow);

    //

    function update() {
        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            tube.getValue(),
            tubularSegments.getValue(),
            radialSegments.getValue(),
            p.getValue(),
            q.getValue()
        )));
    }

    container.render();

    return container;

};

export default TorusKnotGeometryPanel;
