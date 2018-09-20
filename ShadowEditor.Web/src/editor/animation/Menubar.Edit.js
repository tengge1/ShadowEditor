/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Edit = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Edit' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// duplicate

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Duplicate' );
	option.onClick( function () {

		if ( editor.selected === null ) return;

		var selected = editor.selected;

		var offset = selected.end - selected.start;

		var animation = new FRAME.Animation(
			selected.name,
			selected.start + offset,
			selected.end + offset,
			selected.layer,
			selected.effect
		);

		editor.addAnimation( animation );
		editor.selectAnimation( animation );

	} );
	options.add( option );

	// remove

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Remove' );
	option.onClick( function () {

		if ( editor.selected === null ) return;

		editor.removeAnimation( editor.selected );
		editor.selectAnimation( null );

	} );
	options.add( option );

	return container;

};
