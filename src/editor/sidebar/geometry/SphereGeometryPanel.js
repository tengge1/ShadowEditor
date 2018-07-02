import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 球形几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function SphereGeometryPanel(editor, object) {
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

    // widthSegments

    var widthSegmentsRow = new UI.Row();

    var widthSegments = new UI.Integer({
        value: parameters.widthSegments,
        range: [1, Infinity],
        onChange: update
    });

    widthSegmentsRow.add(new UI.Text({
        text: '宽度段数',
        style: 'width: 90px;'
    }));

    widthSegmentsRow.add(widthSegments);

    container.add(widthSegmentsRow);

    // heightSegments

    var heightSegmentsRow = new UI.Row();
    var heightSegments = new UI.Integer({
        value: parameters.heightSegments,
        range: [1, Infinity],
        onChange: update
    });

    heightSegmentsRow.add(new UI.Text({
        text: '高度段数',
        style: 'width: 90px;'
    }));

    heightSegmentsRow.add(heightSegments);

    container.add(heightSegmentsRow);

    // phiStart

    var phiStartRow = new UI.Row();

    var phiStart = new UI.Number({
        value: parameters.phiStart,
        onChange: update
    });

    phiStartRow.add(new UI.Text({
        text: '开始经度',
        style: 'width: 90px;'
    }));

    phiStartRow.add(phiStart);

    container.add(phiStartRow);

    // phiLength

    var phiLengthRow = new UI.Row();
    var phiLength = new UI.Number({
        value: parameters.phiLength,
        onChange: update
    });

    phiLengthRow.add(new UI.Text({
        text: '结束经度',
        style: 'width: 90px;'
    }));

    phiLengthRow.add(phiLength);

    container.add(phiLengthRow);

    // thetaStart

    var thetaStartRow = new UI.Row();

    var thetaStart = new UI.Number({
        value: parameters.thetaStart,
        onChange: update
    });

    thetaStartRow.add(new UI.Text({
        text: '开始纬度',
        style: 'width: 90px;'
    }));

    thetaStartRow.add(thetaStart);

    container.add(thetaStartRow);

    // thetaLength

    var thetaLengthRow = new UI.Row();

    var thetaLength = new UI.Number({
        value: parameters.thetaLength,
        onChange: update
    });

    thetaLengthRow.add(new UI.Text({
        text: '结束纬度',
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
