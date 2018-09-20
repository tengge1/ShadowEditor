/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	var container = this.container = new UI.Panel();
	container.setId( 'viewport' );

	editor.resources.set( 'dom', container.dom );

	editor.signals.fullscreen.add( function () {

		var element = container.dom.firstChild;

		if ( element.requestFullscreen ) element.requestFullscreen();
		if ( element.msRequestFullscreen ) element.msRequestFullscreen();
		if ( element.mozRequestFullScreen ) element.mozRequestFullScreen();
		if ( element.webkitRequestFullscreen ) element.webkitRequestFullscreen();

	} );

	function clear () {

		var dom = container.dom;

		while ( dom.children.length ) {

			dom.removeChild( dom.lastChild );

		}

	}

	signals.editorCleared.add( clear );
	signals.includesCleared.add( clear );

	return container;

};
