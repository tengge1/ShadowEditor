import SetGeometryValueCommand from '../../command/SetGeometryValueCommand';
import GeometryGeometryPanel from './GeometryGeometryPanel';
import BufferGeometryPanel from './BufferGeometryPanel';
import GeometryModifyPanel from './GeometryModifyPanel';

import BoxGeometryPanel from './BoxGeometryPanel';
import CircleGeometryPanel from './CircleGeometryPanel';
import CylinderGeometryPanel from './CylinderGeometryPanel';
import IcosahedronGeometryPanel from './IcosahedronGeometryPanel';
import LatheGeometryPanel from './LatheGeometryPanel';
import PlaneGeometryPanel from './PlaneGeometryPanel';
import SphereGeometryPanel from './SphereGeometryPanel';
import TeapotBufferGeometryPanel from './TeapotBufferGeometryPanel';
import TorusGeometryPanel from './TorusGeometryPanel';
import TorusKnotGeometryPanel from './TorusKnotGeometryPanel';

import UI from '../../ui/UI';

/**
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
    'TeapotGeometry': TeapotBufferGeometryPanel,
    'TeapotBufferGeometry': TeapotBufferGeometryPanel,
    'TorusGeometry': TorusGeometryPanel,
    'TorusBufferGeometry': TorusGeometryPanel,
    'TorusKnotGeometry': TorusKnotGeometryPanel,
    'TorusKnotBufferGeometry': TorusKnotGeometryPanel
};

function GeometryPanel(editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // Actions

    /*
	var objectActions = new UI.Select().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Center': 'Center',
		'Convert': 'Convert',
		'Flatten': 'Flatten'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		var action = this.getValue();

		var object = editor.selected;
		var geometry = object.geometry;

		if ( confirm( action + ' ' + object.name + '?' ) === false ) return;

		switch ( action ) {

			case 'Center':

				var offset = geometry.center();

				var newPosition = object.position.clone();
				newPosition.sub( offset );
				editor.execute( new SetPositionCommand( object, newPosition ) );

				editor.signals.geometryChanged.dispatch( object );

				break;

			case 'Convert':

				if ( geometry instanceof THREE.Geometry ) {

					editor.execute( new SetGeometryCommand( object, new THREE.BufferGeometry().fromGeometry( geometry ) ) );

				}

				break;

			case 'Flatten':

				var newGeometry = geometry.clone();
				newGeometry.uuid = geometry.uuid;
				newGeometry.applyMatrix( object.matrix );

				var cmds = [ new SetGeometryCommand( object, newGeometry ),
					new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ),
					new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ),
					new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) ];

				editor.execute( new MultiCmdsCommand( cmds ), 'Flatten Geometry' );

				break;

		}

		this.setValue( 'Actions' );

	} );
	container.addStatic( objectActions );
	*/

    // type

    var geometryTypeRow = new UI.Row();
    var geometryType = new UI.Text();

    geometryTypeRow.add(new UI.Text('类型').setWidth('90px'));
    geometryTypeRow.add(geometryType);

    container.add(geometryTypeRow);

    // uuid

    var geometryUUIDRow = new UI.Row();
    var geometryUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
    var geometryUUIDRenew = new UI.Button('新建').setMarginLeft('7px').onClick(function () {

        geometryUUID.setValue(THREE.Math.generateUUID());

        editor.execute(new SetGeometryValueCommand(editor.selected, 'uuid', geometryUUID.getValue()));

    });

    geometryUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
    geometryUUIDRow.add(geometryUUID);
    geometryUUIDRow.add(geometryUUIDRenew);

    container.add(geometryUUIDRow);

    // name

    var geometryNameRow = new UI.Row();
    var geometryName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {

        editor.execute(new SetGeometryValueCommand(editor.selected, 'name', geometryName.getValue()));

    });

    geometryNameRow.add(new UI.Text('名称').setWidth('90px'));
    geometryNameRow.add(geometryName);

    container.add(geometryNameRow);

    // geometry

    container.add(new GeometryGeometryPanel(editor));

    // buffergeometry

    container.add(new BufferGeometryPanel(editor));

    // parameters

    var parameters = new UI.Span();
    container.add(parameters);


    //

    function build() {

        var object = editor.selected;

        if (object && object.geometry) {

            var geometry = object.geometry;

            container.setDisplay('block');

            geometryType.setValue(geometry.type);

            geometryUUID.setValue(geometry.uuid);
            geometryName.setValue(geometry.name);

            //

            parameters.clear();

            if (geometry.type === 'BufferGeometry' || geometry.type === 'Geometry') {

                parameters.add(new GeometryModifyPanel(editor, object));

            } else if (GeometryPanels[geometry.type] !== undefined) {

                parameters.add(new GeometryPanels[geometry.type](editor, object));

            }

        } else {

            container.setDisplay('none');

        }

    }

    signals.objectSelected.add(build);
    signals.geometryChanged.add(build);

    return container;

};

export default GeometryPanel;