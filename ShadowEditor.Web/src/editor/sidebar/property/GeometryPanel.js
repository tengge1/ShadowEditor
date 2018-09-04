import UI from '../../../ui/UI';

import SetGeometryValueCommand from '../../../command/SetGeometryValueCommand';
import GeometryInfoPanel from '../geometry/GeometryInfoPanel';
import BufferGeometryPanel from '../geometry/BufferGeometryPanel';

/**
 * 几何体面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function GeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

GeometryPanel.prototype = Object.create(UI.Control.prototype);
GeometryPanel.prototype.constructor = GeometryPanel;

GeometryPanel.prototype.render = function () {
    var editor = this.app.editor;

    this.children = [{
        xtype: 'div',
        id: 'geometryPanel',
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '几何属性'
            }]
        }, { // type
            xtype: 'row',
            id: 'geometryTypeRow',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'text',
                id: 'geometryType'
            }]
        }, { // name
            xtype: 'row',
            id: 'geometryNameRow',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'geometryName',
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: function () {
                    editor.execute(new SetGeometryValueCommand(editor.selected, 'name', this.getValue()));
                }
            }]
        }, {
            xtype: 'row',
            id: 'geometryParameters',
            children: [
                new BufferGeometryPanel({ app: this.app })
            ]
        },
        new GeometryInfoPanel({ app: this.app, id: 'geometryInfoPanel' })
        ]
    }];

    var container = UI.create(this.children[0]);
    container.render();
};

export default GeometryPanel;