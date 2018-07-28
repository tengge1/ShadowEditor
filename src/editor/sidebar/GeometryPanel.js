import UI from '../../ui/UI';

import SetGeometryValueCommand from '../../command/SetGeometryValueCommand';
import GeometryInfoPanel from './geometry/GeometryInfoPanel';
import BufferGeometryPanel from './geometry/BufferGeometryPanel';

import BoxGeometryPanel from './geometry/BoxGeometryPanel';
import CircleGeometryPanel from './geometry/CircleGeometryPanel';
import CylinderGeometryPanel from './geometry/CylinderGeometryPanel';
import IcosahedronGeometryPanel from './geometry/IcosahedronGeometryPanel';
import LatheGeometryPanel from './geometry/LatheGeometryPanel';
import PlaneGeometryPanel from './geometry/PlaneGeometryPanel';
import SphereGeometryPanel from './geometry/SphereGeometryPanel';
import TorusGeometryPanel from './geometry/TorusGeometryPanel';
import TorusKnotGeometryPanel from './geometry/TorusKnotGeometryPanel';

/**
 * 几何体面板
 * @author mrdoob / http://mrdoob.com/
 */
const GeometryPanels = {
    'BoxGeometry': BoxGeometryPanel,
    'BoxBufferGeometry': BoxGeometryPanel,
    'CircleGeometry': CircleGeometryPanel,
    'CircleBufferGeometry': CircleGeometryPanel,
    'CylinderGeometry': CylinderGeometryPanel,
    'CylinderBufferGeometry': CylinderGeometryPanel,
    'IcosahedronGeometry': IcosahedronGeometryPanel,
    'IcosahedronBufferGeometry': IcosahedronGeometryPanel,
    'LatheGeometry': LatheGeometryPanel,
    'LatheBufferGeometry': LatheGeometryPanel,
    'PlaneGeometry': PlaneGeometryPanel,
    'PlaneBufferGeometry': PlaneGeometryPanel,
    'SphereGeometry': SphereGeometryPanel,
    'SphereBufferGeometry': SphereGeometryPanel,
    'TorusGeometry': TorusGeometryPanel,
    'TorusBufferGeometry': TorusGeometryPanel,
    'TorusKnotGeometry': TorusKnotGeometryPanel,
    'TorusKnotBufferGeometry': TorusKnotGeometryPanel
};

function GeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

GeometryPanel.prototype = Object.create(UI.Control.prototype);
GeometryPanel.prototype.constructor = GeometryPanel;

GeometryPanel.prototype.render = function () {
    var editor = this.app.editor;

    var data = {
        xtype: 'div',
        id: 'geometryPanel',
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            paddingTop: '20px'
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
            xtype: 'span',
            id: 'geometryParameters'
        }]
    };

    var container = UI.create(data);
    container.render();

    var geometryType = UI.get('geometryType');
    var geometryUUID = UI.get('geometryUUID');
    var geometryName = UI.get('geometryName');
    var parameters = UI.get('geometryParameters');

    var typedGeometryPanel = null;

    function build() {
        var object = editor.selected;

        if (object && object.geometry) {
            var geometry = object.geometry;

            geometryType.setValue(geometry.type);
            geometryUUID.setValue(geometry.uuid);
            geometryName.setValue(geometry.name);

            //

            parameters.dom.innerHTML = '';

            if (GeometryPanels[geometry.type] !== undefined) {
                if (typedGeometryPanel) {
                    typedGeometryPanel.destroy();
                }
                typedGeometryPanel = new GeometryPanels[geometry.type]({ app: app, object: object, parent: parameters.dom });
                typedGeometryPanel.render();
            } else {

            }
        }
    }

    // geometry
    var geometryInfoPanel = new GeometryInfoPanel({ app: this.app, parent: container.dom });
    geometryInfoPanel.render();

    // buffergeometry
    (new BufferGeometryPanel({ app: this.app, parent: container.dom })).render();

    container.dom.appendChild(parameters.dom);

    this.app.on('objectSelected.GeometryPanel', function () {
        build();
    });

    this.app.on('geometryChanged.GeometryPanel', function () {
        build();
    });
};

export default GeometryPanel;