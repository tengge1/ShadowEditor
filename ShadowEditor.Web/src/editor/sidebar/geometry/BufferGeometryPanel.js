import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 缓冲几何体面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function BufferGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

BufferGeometryPanel.prototype = Object.create(UI.Control.prototype);
BufferGeometryPanel.prototype.constructor = BufferGeometryPanel;

BufferGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;

    var data = {
        xtype: 'row',
        id: 'bufferGeometryPanel',
        parent: this.parent
    };

    var container = UI.create(data);
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
                var panel = UI.create({
                    xtype: 'row',
                    parent: container.dom,
                    children: [{
                        xtype: 'label',
                        text: '索引数'
                    }, {
                        xtype: 'text',
                        text: (index.count).format(),
                        style: {
                            fontSize: '12px'
                        }
                    }]
                });

                panel.render();
            }

            var attributes = geometry.attributes;

            for (var name in attributes) {

                var attribute = attributes[name];

                var panel = UI.create({
                    xtype: 'row',
                    parent: container.dom,
                    children: [{
                        xtype: 'label',
                        text: name
                    }, {
                        xtype: 'text',
                        text: (attribute.count).format() + ' (' + attribute.itemSize + ')',
                        style: {
                            fontSize: '12px'
                        }
                    }]
                });

                panel.render();
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
};

export default BufferGeometryPanel;