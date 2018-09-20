/**
 * @author mrdoob / http://mrdoob.com/
 */

var Controls = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'controls' );

	var row = new UI.Row();
	row.setPadding( '6px' );
	container.add( row );

	var prevButton = new UI.Button();
	prevButton.setBackground( 'url(files/prev.svg)' );
	prevButton.setWidth( '20px' );
	prevButton.setHeight( '20px' );
	prevButton.setMarginRight( '4px' );
	prevButton.setVerticalAlign( 'middle' );
	prevButton.onClick( function () {

		editor.setTime( editor.player.currentTime - 1 );

	} );
	row.add( prevButton );

	var playButton = new UI.Button();
	playButton.setBackground( 'url(files/play.svg)' );
	playButton.setWidth( '20px' );
	playButton.setHeight( '20px' );
	playButton.setMarginRight( '4px' );
	playButton.setVerticalAlign( 'middle' );
	playButton.onClick( function () {

		editor.player.isPlaying ? editor.stop() : editor.play();

	} );
	row.add( playButton );

	var nextButton = new UI.Button();
	nextButton.setBackground( 'url(files/next.svg)' );
	nextButton.setWidth( '20px' );
	nextButton.setHeight( '20px' );
	nextButton.setMarginRight( '4px' );
	nextButton.setVerticalAlign( 'middle' );
	nextButton.onClick( function () {

		editor.setTime( editor.player.currentTime + 1 );

	} );
	row.add( nextButton );

	function ignoreKeys( event ) {

		switch ( event.keyCode ) {

			case 13: case 32: event.preventDefault();

		}

	};

	prevButton.onKeyDown( ignoreKeys );
	playButton.onKeyDown( ignoreKeys );
	nextButton.onKeyDown( ignoreKeys );

	var timeText = new UI.Text();
	timeText.setColor( '#bbb' );
	timeText.setWidth( '60px' );
	timeText.setMarginLeft( '10px' );
	timeText.setValue( '0:00.00' );
	row.add( timeText );

	function updateTimeText( value ) {

		var minutes = Math.floor( value / 60 );
		var seconds = value % 60;
		var padding = seconds < 10 ? '0' : '';

		timeText.setValue( minutes + ':' + padding + seconds.toFixed( 2 ) );

	}

	var playbackRateText = new UI.Text();
	playbackRateText.setColor( '#999' );
	playbackRateText.setMarginLeft( '8px' );
	playbackRateText.setValue( '1.0x' );
	row.add( playbackRateText );

	function updatePlaybackRateText( value ) {

		playbackRateText.setValue( value.toFixed( 1 ) + 'x' );

	}

	var fullscreenButton = new UI.Button();
	fullscreenButton.setBackground( 'url(files/fullscreen.svg)' );
	fullscreenButton.setWidth( '20px' );
	fullscreenButton.setHeight( '20px' );
	fullscreenButton.setFloat( 'right' );
	fullscreenButton.setVerticalAlign( 'middle' );
	fullscreenButton.onClick( function () {

		editor.signals.fullscreen.dispatch();

	} );
	row.add( fullscreenButton );

	//

	signals.playingChanged.add( function ( isPlaying ) {

		playButton.setBackground( isPlaying ? 'url(files/pause.svg)' : 'url(files/play.svg)' )

	} );

	signals.playbackRateChanged.add( function ( value ) {

		updatePlaybackRateText( value );

	} );

	signals.timeChanged.add( function ( value ) {

		updateTimeText( value );

	} );

	return container;

};
