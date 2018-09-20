/**
 * @author mrdoob / http://mrdoob.com/
 */

Timeline.Curves = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	var selected = null;
	var scale = 32;

	var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	svg.style.position = 'fixed';
	svg.setAttribute( 'width', 2048 );
	svg.setAttribute( 'height', 128 );
	container.dom.appendChild( svg );

	var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
	path.setAttribute( 'style', 'stroke: #444444; stroke-width: 1px; fill: none;' );
	path.setAttribute( 'd', 'M 0 64 2048 65');
	svg.appendChild( path );

	var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
	path.setAttribute( 'style', 'stroke: #00ff00; stroke-width: 1px; fill: none;' );
	svg.appendChild( path );

	function drawCurve() {

		/*
		var curve = selected;
		var drawing = '';

		for ( var i = 0; i <= 2048; i ++ ) {

			curve.update( i / scale );

			drawing += ( i === 0 ? 'M' : 'L' ) + i + ' ' + ( ( 1 - curve.value ) * 64 ) + ' ';

		}

		path.setAttribute( 'd', drawing );
		*/

	}

	// signals

	signals.curveAdded.add( function ( curve ) {

		if ( curve instanceof FRAME.Curves.Saw ) {

			selected = curve;

			drawCurve();

		}

	} );

	signals.timelineScaled.add( function ( value ) {

		scale = value;

		drawCurve();

	} );

	return container;

};
