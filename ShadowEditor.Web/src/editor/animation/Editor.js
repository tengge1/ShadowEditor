/**
 * @author mrdoob / http://mrdoob.com/
 */

var Editor = function () {

	var Signal = signals.Signal;

	this.signals = {

		editorCleared: new Signal(),

		// libraries

		libraryAdded: new Signal(),

		// includes

		includeAdded: new Signal(),
		includeSelected: new Signal(),
		includeChanged: new Signal(),
		includeRemoved: new Signal(),
		includesCleared: new Signal(),

		// effects

		effectAdded: new Signal(),
		effectRenamed: new Signal(),
		effectRemoved: new Signal(),
		effectSelected: new Signal(),
		effectCompiled: new Signal(),

		// actions

		fullscreen: new Signal(),
		exportState: new Signal(),

		// animations

		animationRenamed: new Signal(),
		animationAdded: new Signal(),
		animationModified: new Signal(),
		animationRemoved: new Signal(),
		animationSelected: new Signal(),

		// curves

		curveAdded: new Signal(),

		// events

		playingChanged: new Signal(),
		playbackRateChanged: new Signal(),
		timeChanged: new Signal(),
		timelineScaled: new Signal(),

		windowResized: new Signal()

	};

	this.config = new Config();

	this.player = new FRAME.Player();
	this.resources = new FRAME.Resources();

	this.duration = 500;

	this.libraries = [];
	this.includes = [];
	this.effects = [];
	this.timeline = new FRAME.Timeline();

	this.selected = null;

	// signals

	var scope = this;

	this.signals.animationModified.add( function () {

		scope.timeline.reset();
		scope.timeline.sort();

		try {

			scope.timeline.update( scope.player.currentTime );

		} catch ( e ) {

			console.error( e );

		}

	} );

	this.signals.effectCompiled.add( function () {

		try {

			scope.timeline.update( scope.player.currentTime );

		} catch ( e ) {

			console.error( e );

		}

	} );

	this.signals.timeChanged.add( function () {

		try {

			scope.timeline.update( scope.player.currentTime );

		} catch ( e ) {

			console.error( e );

		}

	} );

	// Animate

	var prevTime = 0;

	function animate( time ) {

		scope.player.tick( time - prevTime );

		if ( scope.player.isPlaying ) {

			scope.signals.timeChanged.dispatch( scope.player.currentTime );

		}

		prevTime = time;

		requestAnimationFrame( animate );

	}

	requestAnimationFrame( animate );

};

Editor.prototype = {

	play: function () {

		this.player.play();
		this.signals.playingChanged.dispatch( true );

	},

	stop: function () {

		this.player.pause();
		this.signals.playingChanged.dispatch( false );

	},

	speedUp: function () {

		this.player.playbackRate += 0.1;
		this.signals.playbackRateChanged.dispatch( this.player.playbackRate );

	},

	speedDown: function () {

		this.player.playbackRate -= 0.1;
		this.signals.playbackRateChanged.dispatch( this.player.playbackRate );

	},

	setTime: function ( time ) {

		// location.hash = time;

		this.player.currentTime = Math.max( 0, time );
		this.signals.timeChanged.dispatch( this.player.currentTime );

	},

	// libraries

	addLibrary: function ( url, content ) {

		var script = document.createElement( 'script' );
		script.id = 'library-' + this.libraries.length;
		script.textContent = content;
		document.head.appendChild( script );

		this.libraries.push( url );
		this.signals.libraryAdded.dispatch();

	},

	// includes

	addInclude: function ( name, source ) {

		try {
			new Function( 'resources', source )( this.resources );
		} catch ( e ) {
			console.error( e );
		}

		this.includes.push( { name: name, source: source } );
		this.signals.includeAdded.dispatch();

	},

	removeInclude: function ( include ) {

		var index = this.includes.indexOf( include );

		this.includes.splice( index, 1 );
		this.signals.includeRemoved.dispatch();

	},

	selectInclude: function ( include ) {

		this.signals.includeSelected.dispatch( include );

	},

	reloadIncludes: function () {

		var includes = this.includes;

		this.signals.includesCleared.dispatch();

		for ( var i = 0; i < includes.length; i ++ ) {

			var include = includes[ i ];

			try {
				new Function( 'resources', include.source )( this.resources );
			} catch ( e ) {
				console.error( e );
			}

		}

	},

	// effects

	addEffect: function ( effect ) {

		this.effects.push( effect );
		this.signals.effectAdded.dispatch( effect );

	},

	selectEffect: function ( effect ) {

		this.signals.effectSelected.dispatch( effect );

	},

	removeEffect: function ( effect ) {

		var index = this.effects.indexOf( effect );

		if ( index >= 0 ) {

			this.effects.splice( index, 1 );
			this.signals.effectRemoved.dispatch( effect );

		}

	},

	compileEffect: function ( effect ) {

		try {

			effect.compile( this.resources, this.player );

		} catch ( e ) {

			console.error( e );

		}

		this.signals.effectCompiled.dispatch( effect );

	},

	// Remove any effects that are not bound to any animations.

	cleanEffects: function () {

		var scope = this;
		var effects = this.effects.slice( 0 );
		var animations = this.timeline.animations;

		effects.forEach( function ( effect, i ) {

			var bound = false;

			for ( var j = 0; j < animations.length; j++ ) {

				var animation = animations[ j ];

				if ( animation.effect === effect ) {

					bound = true;
					break;

				}

			}

			if ( bound === false ) {

				scope.removeEffect( effect );

			}

		} );

	},

	// animations

	addAnimation: function ( animation ) {

		var effect = animation.effect;

		if ( effect.program === null ) {

			this.compileEffect( effect );

		}

		this.timeline.add( animation );
		this.signals.animationAdded.dispatch( animation );

	},

	selectAnimation: function ( animation ) {

		if ( this.selected === animation ) return;

		this.selected = animation;
		this.signals.animationSelected.dispatch( animation );

	},

	removeAnimation: function ( animation ) {

		this.timeline.remove( animation );
		this.signals.animationRemoved.dispatch( animation );

	},

	addCurve: function ( curve ) {

		this.timeline.curves.push( curve );
		this.signals.curveAdded.dispatch( curve );

	},

	clear: function () {

		this.libraries = [];
		this.includes = [];
		this.effects = [];

		while ( this.timeline.animations.length > 0 ) {

			this.removeAnimation( this.timeline.animations[ 0 ] );

		}

		this.signals.editorCleared.dispatch();

	},

	fromJSON: function ( json ) {

		function loadFile( url, onLoad ) {

			var request = new XMLHttpRequest();
			request.open( 'GET', url, true );
			request.addEventListener( 'load', function ( event ) {

				onLoad( event.target.response );

			} );
			request.send( null );

		}

		function loadLibraries( libraries, onLoad ) {

			var count = 0;

			function loadNext() {

				if ( count === libraries.length ) {

					onLoad();
					return;

				}

				var url = libraries[ count ++ ];

				loadFile( url, function ( content ) {

					scope.addLibrary( url, content );
					loadNext();

				} );

			}

			loadNext();

		}

		var scope = this;

		var libraries = json.libraries || [];

		loadLibraries( libraries, function () {

			var includes = json.includes;

			for ( var i = 0, l = includes.length; i < l; i ++ ) {

				var data = includes[ i ];

				var name = data[ 0 ];
				var source = data[ 1 ];

				if ( Array.isArray( source ) ) source = source.join( '\n' );

				scope.addInclude( name, source );

			}

			var effects = json.effects;

			for ( var i = 0, l = effects.length; i < l; i ++ ) {

				var data = effects[ i ];

				var name = data[ 0 ];
				var source = data[ 1 ];

				if ( Array.isArray( source ) ) source = source.join( '\n' );

				scope.addEffect( new FRAME.Effect( name, source ) );

			}

			var animations = json.animations;

			for ( var i = 0, l = animations.length; i < l; i ++ ) {

				var data = animations[ i ];

				var animation = new FRAME.Animation(
					data[ 0 ],
					data[ 1 ],
					data[ 2 ],
					data[ 3 ],
					scope.effects[ data[ 4 ] ],
					data[ 5 ]
				);

				scope.addAnimation( animation );

			}

			scope.setTime( 0 );

		} );

	},

	toJSON: function () {

		var json = {
			"config": {},
			"libraries": this.libraries.slice(),
			"includes": [],
			"effects": [],
			// "curves": [],
			"animations": []
		};

		/*
		// curves

		var curves = this.timeline.curves;

		for ( var i = 0, l = curves.length; i < l; i ++ ) {

			var curve = curves[ i ];

			if ( curve instanceof FRAME.Curves.Linear ) {

				json.curves.push( [ 'linear', curve.points ] );

			}

		}
		*/

		// includes

		var includes = this.includes;

		for ( var i = 0, l = includes.length; i < l; i ++ ) {

			var include = includes[ i ];

			var name = include.name;
			var source = include.source;

			json.includes.push( [ name, source.split( '\n' ) ] );

		}

		// effects

		var effects = this.effects;

		for ( var i = 0, l = effects.length; i < l; i ++ ) {

			var effect = effects[ i ];

			var name = effect.name;
			var source = effect.source;

			json.effects.push( [ name, source.split( '\n' ) ] );

		}

		// animations

		var animations = this.timeline.animations;

		for ( var i = 0, l = animations.length; i < l; i ++ ) {

			var animation = animations[ i ];
			var effect = animation.effect;

			/*
			var parameters = {};

			for ( var key in module.parameters ) {

				parameters[ key ] = module.parameters[ key ].value;

			}
			*/

			json.animations.push( [
				animation.name,
				animation.start,
				animation.end,
				animation.layer,
				this.effects.indexOf( animation.effect ),
				animation.enabled
			] );

		}

		return json;

	}

};
