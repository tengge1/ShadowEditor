import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function GeometryModifyPanel(editor, object) {
    this.app = editor.app;

    var signals = editor.signals;

    var container = new UI.Row().setPaddingLeft('90px');

    var geometry = object.geometry;

    // Compute Vertex Normals

    var button = new UI.Button('计算顶点法线');

    var _this = this;
    button.onClick(function () {

        geometry.computeVertexNormals();

        if (geometry instanceof THREE.BufferGeometry) {

            geometry.attributes.normal.needsUpdate = true;

        } else {

            geometry.normalsNeedUpdate = true;

        }

        _this.app.call('geometryChanged', _this, object);
    });

    container.add(button);

    //

    return container;

};

export default GeometryModifyPanel;