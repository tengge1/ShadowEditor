import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 圆形几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function CircleGeometryPanel(editor, object) {
    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radius

    var radiusRow = new UI.Row();

    var radius = new UI.Number({
        value: parameters.radius,
        onChange: update
    });

    radiusRow.add(new UI.Label({
        text: '半径'
    }));

    radiusRow.add(radius);

    container.add(radiusRow);

    // segments

    var segmentsRow = new UI.Row();

    var segments = new UI.Integer({
        value: parameters.segments,
        range: [3, Infinity],
        onChange: update
    });

    segmentsRow.add(new UI.Label({
        text: '段数'
    }));

    segmentsRow.add(segments);

    container.add(segmentsRow);

    // thetaStart

    var thetaStartRow = new UI.Row();

    var thetaStart = new UI.Number({
        value: parameters.thetaStart,
        onChange: update
    });

    thetaStartRow.add(new UI.Label({
        text: '开始弧度'
    }));

    thetaStartRow.add(thetaStart);

    container.add(thetaStartRow);

    // thetaLength

    var thetaLengthRow = new UI.Row();
    var thetaLength = new UI.Number({
        value: parameters.thetaLength,
        onChange: update,
        value: Math.PI * 2
    });

    thetaLengthRow.add(new UI.Label({
        text: '结束弧度'
    }));

    thetaLengthRow.add(thetaLength);

    container.add(thetaLengthRow);

    //

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            segments.getValue(),
            thetaStart.getValue(),
            thetaLength.getValue()
        )));

    }

    container.render();

    return container;
};

export default CircleGeometryPanel;
