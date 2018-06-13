import Panel from '../../ui/Panel';
import Row from '../../ui/Row';
import HorizontalRule from '../../ui/HorizontalRule';
import Text from '../../ui/Text';
import Boolean from '../../ui/Boolean';
import Break from '../../ui/Break';
import Button from '../../ui/Button';
import Number from '../../ui/Number';
import Integer from '../../ui/Integer';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function BoxGeometryPanel(editor, object) {

    var signals = editor.signals;

    var container = new Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // width

    var widthRow = new Row();
    var width = new Number(parameters.width).onChange(update);

    widthRow.add(new Text('宽度').setWidth('90px'));
    widthRow.add(width);

    container.add(widthRow);

    // height

    var heightRow = new Row();
    var height = new Number(parameters.height).onChange(update);

    heightRow.add(new Text('高度').setWidth('90px'));
    heightRow.add(height);

    container.add(heightRow);

    // depth

    var depthRow = new Row();
    var depth = new Number(parameters.depth).onChange(update);

    depthRow.add(new Text('深度').setWidth('90px'));
    depthRow.add(depth);

    container.add(depthRow);

    // widthSegments

    var widthSegmentsRow = new Row();
    var widthSegments = new Integer(parameters.widthSegments).setRange(1, Infinity).onChange(update);

    widthSegmentsRow.add(new Text('宽度段数').setWidth('90px'));
    widthSegmentsRow.add(widthSegments);

    container.add(widthSegmentsRow);

    // heightSegments

    var heightSegmentsRow = new Row();
    var heightSegments = new Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

    heightSegmentsRow.add(new Text('高度段数').setWidth('90px'));
    heightSegmentsRow.add(heightSegments);

    container.add(heightSegmentsRow);

    // depthSegments

    var depthSegmentsRow = new Row();
    var depthSegments = new Integer(parameters.depthSegments).setRange(1, Infinity).onChange(update);

    depthSegmentsRow.add(new Text('深度段数').setWidth('90px'));
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

    return container;

};

export default BoxGeometryPanel;