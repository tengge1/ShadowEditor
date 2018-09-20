/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Help = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Help' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// source code

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Source code' );
	option.onClick( function () { window.open( 'https://github.com/mrdoob/frame.js/tree/master/editor', '_blank' ) } );
	options.add( option );

	// about

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'About' );
	option.onClick( function () { window.open( 'http://github.com/mrdoob/frame.js/', '_blank' ) } );
	options.add( option );

	return container;

}
