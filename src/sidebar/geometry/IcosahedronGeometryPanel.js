import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI2 from '../../ui2/UI';

/**
 * 二十面体几何体
 * @author mrdoob / http://mrdoob.com/
 */
function IcosahedronGeometryPanel(editor, object) {
    this.app = editor.app;

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

    // detail

    var detailRow = new UI2.Row();

    var detail = new UI2.Integer({
        value: parameters.detail,
        range: [0, Infinity],
        onChange: update
    });

    detailRow.add(new UI2.Text({
        text: '详细',
        style: 'width: 90px;'
    }));

    detailRow.add(detail);

    container.add(detailRow);


    //

    var _this = this;

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            detail.getValue()
        )));

        _this.app.call('objectChanged', _this, object);

    }

    container.render();

    return container;
};

export default IcosahedronGeometryPanel;
