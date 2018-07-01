import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 圆柱体
 * @author mrdoob / http://mrdoob.com/
 */
function CylinderGeometryPanel(editor, object) {
    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radiusTop

    var radiusTopRow = new UI.Row();
    var radiusTop = new UI.Number({
        value: parameters.radiusTop,
        onChange: update
    });

    radiusTopRow.add(new UI.Text({
        text: '顶部半径',
        style: 'width: 90px;'
    }));

    radiusTopRow.add(radiusTop);

    container.add(radiusTopRow);

    // radiusBottom

    var radiusBottomRow = new UI.Row();

    var radiusBottom = new UI.Number({
        value: parameters.radiusBottom,
        onChange: update
    });

    radiusBottomRow.add(new UI.Text({
        text: '底部半径',
        style: 'width: 90px;'
    }));

    radiusBottomRow.add(radiusBottom);

    container.add(radiusBottomRow);

    // height

    var heightRow = new UI.Row();

    var height = new UI.Number({
        value: parameters.height,
        onChange: update
    });

    heightRow.add(new UI.Text({
        text: '高度',
        style: 'width: 90px;'
    }));

    heightRow.add(height);

    container.add(heightRow);

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

    // openEnded

    var openEndedRow = new UI.Row();

    var openEnded = new UI.Checkbox({
        value: parameters.openEnded,
        onChange: update
    });

    openEndedRow.add(new UI.Text({
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
