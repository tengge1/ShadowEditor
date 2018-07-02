import SetGeometryValueCommand from '../../../command/SetGeometryValueCommand';
import GeometryInfoPanel from './GeometryInfoPanel';
import BufferGeometryPanel from './BufferGeometryPanel';
import GeometryModifyPanel from './GeometryModifyPanel';

import BoxGeometryPanel from './BoxGeometryPanel';
import CircleGeometryPanel from './CircleGeometryPanel';
import CylinderGeometryPanel from './CylinderGeometryPanel';
import IcosahedronGeometryPanel from './IcosahedronGeometryPanel';
import LatheGeometryPanel from './LatheGeometryPanel';
import PlaneGeometryPanel from './PlaneGeometryPanel';
import SphereGeometryPanel from './SphereGeometryPanel';
import TorusGeometryPanel from './TorusGeometryPanel';
import TorusKnotGeometryPanel from './TorusKnotGeometryPanel';

import UI from '../../../ui/UI';

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

function GeometryPanel(editor) {
    this.app = editor.app;

    var container = new UI.Div({
        cls: 'Panel',
        style: 'border-top: 0; padding-top: 20px;'
    });

    // type

    var geometryTypeRow = new UI.Row();

    var geometryType = new UI.Text();

    geometryTypeRow.add(new UI.Text({
        text: '类型',
        style: 'width: 90px;'
    }));

    geometryTypeRow.add(geometryType);

    container.add(geometryTypeRow);

    // uuid

    var geometryUUIDRow = new UI.Row();

    var geometryUUID = new UI.Input({
        style: 'width: 102px; font-size: 12px;',
        disabled: true
    });

    var geometryUUIDRenew = new UI.Button({
        text: '新建',
        style: 'margin-left: 7px;',
        onClick: function () {
            geometryUUID.setValue(THREE.Math.generateUUID());
            editor.execute(new SetGeometryValueCommand(editor.selected, 'uuid', geometryUUID.getValue()));
        }
    });

    geometryUUIDRow.add(new UI.Text({
        text: 'UUID',
        style: 'width: 90px;'
    }));

    geometryUUIDRow.add(geometryUUID);

    geometryUUIDRow.add(geometryUUIDRenew);

    container.add(geometryUUIDRow);

    // name

    var geometryNameRow = new UI.Row();

    var geometryName = new UI.Input({
        style: 'width: 150px; font-size: 12px;',
        onChange: function () {
            editor.execute(new SetGeometryValueCommand(editor.selected, 'name', geometryName.getValue()));
        }
    });

    geometryNameRow.add(new UI.Text({
        text: '名称',
        style: 'width: 90px;'
    }));

    geometryNameRow.add(geometryName);

    container.add(geometryNameRow);

    container.render();

    // parameters

    var parameters = new UI.Span();
    parameters.render();

    //

    function build() {

        var object = editor.selected;

        if (object && object.geometry) {

            var geometry = object.geometry;

            container.dom.style.display = 'block';

            geometryType.setValue(geometry.type);

            geometryUUID.setValue(geometry.uuid);
            geometryName.setValue(geometry.name);

            //

            parameters.dom.innerHTML = '';

            if (geometry.type === 'BufferGeometry' || geometry.type === 'Geometry') {
                parameters.dom.appendChild(new GeometryModifyPanel(editor, object).dom);
            }

            if (GeometryPanels[geometry.type] !== undefined) {
                parameters.dom.appendChild(new GeometryPanels[geometry.type](editor, object).dom);
            } else {

            }

        } else {

            container.dom.style.display = 'none';

        }

    }

    // geometry

    container.dom.appendChild(new GeometryInfoPanel(editor).dom);

    // buffergeometry

    container.dom.appendChild(new BufferGeometryPanel(editor).dom);

    container.dom.appendChild(parameters.dom);

    this.app.on('objectSelected.GeometryPanel', function () {
        build();
    });

    this.app.on('geometryChanged.GeometryPanel', function () {
        build();
    });

    return container;

};

export default GeometryPanel;