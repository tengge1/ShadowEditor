import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function BufferGeometryPanel(editor) {
    this.app = editor.app;

    var signals = editor.signals;

    var container = new UI.Row();

    function update(object) {

        if (object === null) return; // objectSelected.dispatch( null )
        if (object === undefined) return;

        var geometry = object.geometry;

        if (geometry instanceof THREE.BufferGeometry) {

            container.clear();
            container.setDisplay('block');

            var index = geometry.index;

            if (index !== null) {

                var panel = new UI.Row();
                panel.add(new UI.Text('索引').setWidth('90px'));
                panel.add(new UI.Text((index.count).format()).setFontSize('12px'));
                container.add(panel);

            }

            var attributes = geometry.attributes;

            for (var name in attributes) {

                var attribute = attributes[name];

                var panel = new UI.Row();
                panel.add(new UI.Text(name).setWidth('90px'));
                panel.add(new UI.Text((attribute.count).format() + ' (' + attribute.itemSize + ')').setFontSize('12px'));
                container.add(panel);

            }

        } else {

            container.setDisplay('none');

        }

    }

    this.app.on('objectSelected.BufferGeometryPanel', function () {
        update();
    });

    this.app.on('geometryChanged.BufferGeometryPanel', function () {
        update();
    });

    return container;

};

export default BufferGeometryPanel;