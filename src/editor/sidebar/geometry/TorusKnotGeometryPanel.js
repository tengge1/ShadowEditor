import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 环面纽结几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function TorusKnotGeometryPanel(editor, object) {
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
        text: '管粗',
        style: 'width: 90px;'
    }));

    tubeRow.add(tube);

    container.add(tubeRow);

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

    // radialSegments

    var radialSegmentsRow = new UI.Row();

    var radialSegments = new UI.Integer({
        value: parameters.radialSegments,
        range: [1, Infinity],
        onChange: update
    });

    radialSegmentsRow.add(new UI.Text({
        text: '管粗段数',
        style: 'width: 90px;'
    }));

    radialSegmentsRow.add(radialSegments);

    container.add(radialSegmentsRow);

    // p

    var pRow = new UI.Row();

    var p = new UI.Number({
        value: parameters.p,
        onChange: update
    });

    pRow.add(new UI.Text({
        text: '管长弧度',
        style: 'width: 90px;'
    }));

    pRow.add(p);

    container.add(pRow);

    // q

    var qRow = new UI.Row();

    var q = new UI.Number({
        value: parameters.q,
        onChange: update
    });

    qRow.add(new UI.Text({
        text: '扭曲弧度',
        style: 'width: 90px;'
    }));

    qRow.add(q);

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
