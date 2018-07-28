import UI from '../../ui/UI';

import SetGeometryValueCommand from '../../command/SetGeometryValueCommand';
import GeometryInfoPanel from './geometry/GeometryInfoPanel';
import BufferGeometryPanel from './geometry/BufferGeometryPanel';

/**
 * 几何体面板
 * @author mrdoob / http://mrdoob.com/
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
            borderTop: 0,
            paddingTop: '20px',
            display: 'none'
        },
        children: [{ // type
            xtype: 'row',
            id: 'geometryTypeRow',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'text',
                id: 'geometryType'
            }]
        }, { // uuid
            xtype: 'row',
            id: 'geometryUUIDRow',
            children: [{
                xtype: 'label',
                text: 'UUID'
            }, {
                xtype: 'input',
                id: 'geometryUUID',
                style: {
                    width: '102px',
                    fontSize: '12px'
                },
                disabled: true
            }, {
                xtype: 'button',
                id: 'geometryUUIDRenew',
                text: '新建',
                style: {
                    marginLeft: '7px'
                },
                onClick: function () {
                    geometryUUID.setValue(THREE.Math.generateUUID());
                    editor.execute(new SetGeometryValueCommand(editor.selected, 'uuid', geometryUUID.getValue()));
                }
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
                    width: '150px',
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