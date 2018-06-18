import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function IcosahedronGeometryPanel(editor, object) {
    this.app = editor.app;

    var signals = editor.signals;

    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radius

    var radiusRow = new UI.Row();
    var radius = new UI.Number(parameters.radius).onChange(update);

    radiusRow.add(new UI.Text('半径').setWidth('90px'));
    radiusRow.add(radius);

    container.add(radiusRow);

    // detail

    var detailRow = new UI.Row();
    var detail = new UI.Integer(parameters.detail).setRange(0, Infinity).onChange(update);

    detailRow.add(new UI.Text('详细').setWidth('90px'));
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

    return container;

};

export default IcosahedronGeometryPanel;
