import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 球形几何体
 * @author mrdoob / http://mrdoob.com/
 */
function SphereGeometryPanel(editor, object) {
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

    // widthSegments

    var widthSegmentsRow = new UI2.Row();

    var widthSegments = new UI2.Integer({
        value: parameters.widthSegments,
        range: [1, Infinity],
        onChange: update
    });

    widthSegmentsRow.add(new UI2.Text({
        text: '宽度段数',
        style: 'width: 90px;'
    }));

    widthSegmentsRow.add(widthSegments);

    container.add(widthSegmentsRow);

    // heightSegments

    var heightSegmentsRow = new UI2.Row();
    var heightSegments = new UI2.Integer({
        value: parameters.heightSegments,
        range: [1, Infinity],
        onChange: update
    });

    heightSegmentsRow.add(new UI2.Text({
        text: '高度段数',
        style: 'width: 90px;'
    }));

    heightSegmentsRow.add(heightSegments);

    container.add(heightSegmentsRow);

    // phiStart

    var phiStartRow = new UI2.Row();

    var phiStart = new UI2.Number({
        value: parameters.phiStart,
        onChange: update
    });

    phiStartRow.add(new UI2.Text({
        text: 'φ开始',
        style: 'width: 90px;'
    }));

    phiStartRow.add(phiStart);

    container.add(phiStartRow);

    // phiLength

    var phiLengthRow = new UI2.Row();
    var phiLength = new UI2.Number({
        value: parameters.phiLength,
        onChange: update
    });

    phiLengthRow.add(new UI2.Text({
        text: 'φ长度',
        style: 'width: 90px;'
    }));

    phiLengthRow.add(phiLength);

    container.add(phiLengthRow);

    // thetaStart

    var thetaStartRow = new UI2.Row();

    var thetaStart = new UI2.Number({
        value: parameters.thetaStart,
        onChange: update
    });

    thetaStartRow.add(new UI2.Text({
        text: 'θ开始',
        style: 'width: 90px;'
    }));

    thetaStartRow.add(thetaStart);

    container.add(thetaStartRow);

    // thetaLength

    var thetaLengthRow = new UI2.Row();

    var thetaLength = new UI2.Number({
        value: parameters.thetaLength,
        onChange: update
    });

    thetaLengthRow.add(new UI2.Text({
        text: 'θ长度',
        style: 'width: 90px;'
    }));

    thetaLengthRow.add(thetaLength);

    container.add(thetaLengthRow);

    //

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            widthSegments.getValue(),
            heightSegments.getValue(),
            phiStart.getValue(),
            phiLength.getValue(),
            thetaStart.getValue(),
            thetaLength.getValue()
        )));

    }

    container.render();

    return container;
};

export default SphereGeometryPanel;
