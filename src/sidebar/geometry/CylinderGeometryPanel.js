import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 圆柱体
 * @author mrdoob / http://mrdoob.com/
 */
function CylinderGeometryPanel(editor, object) {
    var container = new UI2.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radiusTop

    var radiusTopRow = new UI2.Row();
    var radiusTop = new UI2.Number({
        value: parameters.radiusTop,
        onChange: update
    });

    radiusTopRow.add(new UI2.Text({
        text: '顶部半径',
        style: 'width: 90px;'
    }));

    radiusTopRow.add(radiusTop);

    container.add(radiusTopRow);

    // radiusBottom

    var radiusBottomRow = new UI2.Row();

    var radiusBottom = new UI2.Number({
        value: parameters.radiusBottom,
        onChange: update
    });

    radiusBottomRow.add(new UI2.Text({
        text: '底部半径',
        style: 'width: 90px;'
    }));

    radiusBottomRow.add(radiusBottom);

    container.add(radiusBottomRow);

    // height

    var heightRow = new UI2.Row();

    var height = new UI2.Number({
        value: parameters.height,
        onChange: update
    });

    heightRow.add(new UI2.Text({
        text: '高度',
        style: 'width: 90px;'
    }));

    heightRow.add(height);

    container.add(heightRow);

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

    // openEnded

    var openEndedRow = new UI2.Row();

    var openEnded = new UI2.Checkbox({
        value: parameters.openEnded,
        onChange: update
    });

    openEndedRow.add(new UI2.Text({
        text: '打开关闭',
        style: 'width: 90px;'
    }));

    openEndedRow.add(openEnded);

    container.add(openEndedRow);

    //

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radiusTop.getValue(),
            radiusBottom.getValue(),
            height.getValue(),
            radialSegments.getValue(),
            heightSegments.getValue(),
            openEnded.getValue()
        )));

    }

    container.render();

    return container;
};

export default CylinderGeometryPanel;
