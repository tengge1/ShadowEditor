import SetGeometryCommand from '../../../command/SetGeometryCommand';
import UI from '../../../ui/UI';

/**
 * 缓冲几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
function BufferGeometryPanel(editor) {
    this.app = editor.app;

    var container = new UI.Row();
    container.render();

    function update(object) {

        if (object === null) return; // objectSelected.dispatch( null )
        if (object === undefined) return;

        var geometry = object.geometry;

        if (geometry instanceof THREE.BufferGeometry) {

            container.dom.innerHTML = '';
            container.dom.style.display = 'block';

            var index = geometry.index;

            if (index !== null) {
                var panel = new UI.Row();

                panel.add(new UI.Label({
                    text: '索引数'
                }));

                panel.add(new UI.Text({
                    text: (index.count).format(),
                    style: 'font-size: 12px;'
                }));

                panel.render();

                container.dom.appendChild(panel.dom);
            }

            var attributes = geometry.attributes;

            for (var name in attributes) {

                var attribute = attributes[name];

                var panel = new UI.Row();
                panel.add(new UI.Label({
                    text: name
                }));
                panel.add(new UI.Text({
                    text: (attribute.count).format() + ' (' + attribute.itemSize + ')',
                    style: 'font-size: 12px;'
                }));

                panel.render();

                container.dom.appendChild(panel.dom);
            }
        } else {
            container.dom.style.display = 'none';
        }
    }

    this.app.on('objectSelected.BufferGeometryPanel', function (mesh) {
        update(mesh);
    });

    this.app.on('geometryChanged.BufferGeometryPanel', function (mesh) {
        update(mesh);
    });

    return container;
};

export default BufferGeometryPanel;