import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * 几何体修改
 * @author mrdoob / http://mrdoob.com/
 */
function GeometryModifyPanel(editor, object) {
    this.app = editor.app;

    var container = new UI.Row({
        style: 'padding-left: 90px;'
    });

    var geometry = object.geometry;

    // Compute Vertex Normals

    var button = new UI.Button({
        text: '计算顶点法线',
        onClick: function () {
            geometry.computeVertexNormals();

            if (geometry instanceof THREE.BufferGeometry) {

                geometry.attributes.normal.needsUpdate = true;

            } else {

                geometry.normalsNeedUpdate = true;

            }

            _this.app.call('geometryChanged', _this, object);
        }
    });

    var _this = this;

    container.add(button);

    //

    container.render();

    return container;
};

export default GeometryModifyPanel;