/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.View = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'View' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// remove

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Fullscreen' );
	option.onClick( function () {

		editor.signals.fullscreen.dispatch();

	} );
	options.add( option );

	return container;

}
