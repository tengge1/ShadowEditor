import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function GeometryModifyPanel(editor, object) {

    var signals = editor.signals;

    var container = new UI.Row().setPaddingLeft('90px');

    var geometry = object.geometry;

    // Compute Vertex Normals

    var button = new UI.Button('计算顶点法线');
    button.onClick(function () {

        geometry.computeVertexNormals();

        if (geometry instanceof THREE.BufferGeometry) {

            geometry.attributes.normal.needsUpdate = true;

        } else {

            geometry.normalsNeedUpdate = true;

        }

        signals.geometryChanged.dispatch(object);

    });

    container.add(button);

    //

    return container;

};

export default GeometryModifyPanel;