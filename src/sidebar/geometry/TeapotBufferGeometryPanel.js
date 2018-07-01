import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 茶壶几何体
 * @author tschw
 */
function TeapotBufferGeometryPanel(editor, object) {
    this.app = editor.app;

    var container = new UI2.Row();

    var parameters = object.geometry.parameters;

    // size

    var sizeRow = new UI2.Row();

    var size = new UI2.Number({
        value: parameters.size,
        onChange: update
    });

    sizeRow.add(new UI2.Text({
        text: '尺寸',
        style: 'width: 90px;'
    }));

    sizeRow.add(size);

    container.add(sizeRow);

    // segments

    var segmentsRow = new UI2.Row();

    var segments = new UI2.Integer({
        value: parameters.segments,
        range: [1, Infinity],
        onChange: update
    });

    segmentsRow.add(new UI2.Text({
        text: '段数',
        style: 'width: 90px;'
    }));

    segmentsRow.add(segments);

    container.add(segmentsRow);

    // bottom

    var bottomRow = new UI2.Row();

    var bottom = new UI2.Checkbox({
        value: parameters.bottom,
        onChange: update
    });

    bottomRow.add(new UI2.Text({
        text: '底部',
        style: 'width: 90px;'
    }));

    bottomRow.add(bottom);

    container.add(bottomRow);

    // lid

    var lidRow = new UI2.Row();

    var lid = new UI2.Checkbox({
        value: parameters.lid,
        onChange: update
    });

    lidRow.add(new UI2.Text({
        text: '壶盖',
        style: 'width: 90px;'
    }));

    lidRow.add(lid);

    container.add(lidRow);

    // body

    var bodyRow = new UI2.Row();
    var body = new UI2.Checkbox({
        value: parameters.body,
        onChange: update
    });

    bodyRow.add(new UI2.Text({
        text: '壶体',
        style: 'width: 90px;'
    }));
    bodyRow.add(body);

    container.add(bodyRow);

    // fitted lid

    var fitLidRow = new UI2.Row();

    var fitLid = new UI2.Checkbox({
        value: parameters.fitLid,
        onChange: update
    });

    fitLidRow.add(new UI2.Text({
        text: '适合壶盖',
        style: 'width: 90px;'
    }));

    fitLidRow.add(fitLid);

    container.add(fitLidRow);

    // blinn-sized

    var blinnRow = new UI2.Row();

    var blinn = new UI2.Checkbox({
        value: parameters.blinn,
        onChange: update
    });

    blinnRow.add(new UI2.Text({
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