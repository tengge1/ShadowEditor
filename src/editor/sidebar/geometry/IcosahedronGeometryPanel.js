import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 二十面体几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function IcosahedronGeometryPanel(editor, object) {
    this.app = editor.app;

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

    // detail

    var detailRow = new UI.Row();

    var detail = new UI.Integer({
        value: parameters.detail,
        range: [0, Infinity],
        onChange: update
    });

    detailRow.add(new UI.Label({
        text: '面片段数'
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
