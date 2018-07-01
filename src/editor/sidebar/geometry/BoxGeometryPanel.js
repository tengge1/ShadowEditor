import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 长方体几何体
 * @author mrdoob / http://mrdoob.com/
 */
function BoxGeometryPanel(editor, object) {
    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // width

    var widthRow = new UI.Row();
    var width = new UI.Number({
        value: parameters.width,
        onChange: update
    });

    widthRow.add(new UI.Text({
        text: '宽度',
        style: 'width: 90px'
    }));
    widthRow.add(width);

    container.add(widthRow);

    // height

    var heightRow = new UI.Row();
    var height = new UI.Number({
        value: parameters.height,
        onChange: update
    });

    heightRow.add(new UI.Text({
        text: '高度',
        style: 'width: 90px'
    }));
    heightRow.add(height);

    container.add(heightRow);

    // depth

    var depthRow = new UI.Row();

    var depth = new UI.Number({
        value: parameters.depth,
        onChange: update
    });

    depthRow.add(new UI.Text({
        text: '深度',
        style: 'width: 90px'
    }));

    depthRow.add(depth);

    container.add(depthRow);

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

    // depthSegments

    var depthSegmentsRow = new UI.Row();

    var depthSegments = new UI.Integer({
        value: parameters.depthSegments,
        range: [1, Infinity],
        onChange: update
    });

    depthSegmentsRow.add(new UI.Text({
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