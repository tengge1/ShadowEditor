import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 茶壶几何体
 * @author tschw
 */
function TeapotBufferGeometryPanel(editor, object) {
    this.app = editor.app;

    var container = new UI.Row();

    var parameters = object.geometry.parameters;

    // size

    var sizeRow = new UI.Row();

    var size = new UI.Number({
        value: parameters.size,
        onChange: update
    });

    sizeRow.add(new UI.Text({
        text: '尺寸',
        style: 'width: 90px;'
    }));

    sizeRow.add(size);

    container.add(sizeRow);

    // segments

    var segmentsRow = new UI.Row();

    var segments = new UI.Integer({
        value: parameters.segments,
        range: [1, Infinity],
        onChange: update
    });

    segmentsRow.add(new UI.Text({
        text: '段数',
        style: 'width: 90px;'
    }));

    segmentsRow.add(segments);

    container.add(segmentsRow);

    // bottom

    var bottomRow = new UI.Row();

    var bottom = new UI.Checkbox({
        value: parameters.bottom,
        onChange: update
    });

    bottomRow.add(new UI.Text({
        text: '底部',
        style: 'width: 90px;'
    }));

    bottomRow.add(bottom);

    container.add(bottomRow);

    // lid

    var lidRow = new UI.Row();

    var lid = new UI.Checkbox({
        value: parameters.lid,
        onChange: update
    });

    lidRow.add(new UI.Text({
        text: '壶盖',
        style: 'width: 90px;'
    }));

    lidRow.add(lid);

    container.add(lidRow);

    // body

    var bodyRow = new UI.Row();
    var body = new UI.Checkbox({
        value: parameters.body,
        onChange: update
    });

    bodyRow.add(new UI.Text({
        text: '壶体',
        style: 'width: 90px;'
    }));
    bodyRow.add(body);

    container.add(bodyRow);

    // fitted lid

    var fitLidRow = new UI.Row();

    var fitLid = new UI.Checkbox({
        value: parameters.fitLid,
        onChange: update
    });

    fitLidRow.add(new UI.Text({
        text: '适合壶盖',
        style: 'width: 90px;'
    }));

    fitLidRow.add(fitLid);

    container.add(fitLidRow);

    // blinn-sized

    var blinnRow = new UI.Row();

    var blinn = new UI.Checkbox({
        value: parameters.blinn,
        onChange: update
    });

    blinnRow.add(new UI.Text({
        text: 'Blinn缩放',
        style: 'width: 90px;'
    }));

    blinnRow.add(blinn);

    container.add(blinnRow);

    var _this = this;

    function update() {

        object.geometry.dispose();

        object.geometry = new THREE.TeapotBufferGeometry(
            size.getValue(),
            segments.getValue(),
            bottom.getValue(),
            lid.getValue(),
            body.getValue(),
            fitLid.getValue(),
            blinn.getValue()
        );

        object.geometry.computeBoundingSphere();

        _this.app.call('geometryChanged', _this, object);

    }

    container.render();

    return container;
};

export default TeapotBufferGeometryPanel;