import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 长方体几何体
 * @author mrdoob / http://mrdoob.com/
 */
function BoxGeometryPanel(editor, object) {
    var container = new UI2.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // width

    var widthRow = new UI2.Row();
    var width = new UI2.Number({
        value: parameters.width,
        onChange: update
    });

    widthRow.add(new UI2.Text({
        text: '宽度',
        style: 'width: 90px'
    }));
    widthRow.add(width);

    container.add(widthRow);

    // height

    var heightRow = new UI2.Row();
    var height = new UI2.Number({
        value: parameters.height,
        onChange: update
    });

    heightRow.add(new UI2.Text({
        text: '高度',
        style: 'width: 90px'
    }));
    heightRow.add(height);

    container.add(heightRow);

    // depth

    var depthRow = new UI2.Row();

    var depth = new UI2.Number({
        value: parameters.depth,
        onChange: update
    });

    depthRow.add(new UI2.Text({
        text: '深度',
        style: 'width: 90px'
    }));

    depthRow.add(depth);

    container.add(depthRow);

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

    // depthSegments

    var depthSegmentsRow = new UI2.Row();

    var depthSegments = new UI2.Integer({
        value: parameters.depthSegments,
        range: [1, Infinity],
        onChange: update
    });

    depthSegmentsRow.add(new UI2.Text({
        text: '深度段数',
        style: 'width: 90px;'
    }));

    depthSegmentsRow.add(depthSegments);

    container.add(depthSegmentsRow);

    //

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            width.getValue(),
            height.getValue(),
            depth.getValue(),
            widthSegments.getValue(),
            heightSegments.getValue(),
            depthSegments.getValue()
        )));

    }

    container.render();

    return container;
};

export default BoxGeometryPanel;