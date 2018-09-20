/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//

	var animationTab = new UI.Text( 'ANIMATION' ).onClick( onClick );
	var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	// var settingsTab = new UI.Text( 'SETTINGS' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( animationTab, projectTab/*, settingsTab*/ );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var animation = new UI.Span().add(
		new Sidebar.Animation( editor )
	);
	container.add( animation );

	var project = new UI.Span().add(
		new Sidebar.Project( editor )
	);
	container.add( project );
	/*
	var settings = new UI.Span().add(
		new Sidebar.Settings( editor )
	);
	container.add( settings );
	*/

	//

	function select( section ) {

		animationTab.setClass( '' );
		projectTab.setClass( '' );
		// settingsTab.setClass( '' );

		animation.setDisplay( 'none' );
		project.setDisplay( 'none' );
		// settings.setDisplay( 'none' );

		switch ( section ) {
			case 'ANIMATION':
				animationTab.setClass( 'selected' );
				animation.setDisplay( '' );
				break;
			case 'PROJECT':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
			/*
			case 'SETTINGS':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
			*/
		}

	}

	select( 'ANIMATION' );

	return container;

};
