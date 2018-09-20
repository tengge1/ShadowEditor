/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Animation = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'animation' );

	//

	var selected = null;
	var values;

	function createParameterRow( key, parameter ) {

		if ( parameter === null ) return;

		var parameterRow = new UI.Row();
		parameterRow.add( new UI.Text( parameter.name ).setWidth( '90px' ) );

		if ( parameter instanceof FRAME.Parameters.Boolean ) {

			var parameterValue = new UI.Checkbox()
				.setValue( parameter.value )
				.onChange( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter instanceof FRAME.Parameters.Integer ) {

			var parameterValue = new UI.Integer()
				.setRange( parameter.min, parameter.max )
				.setValue( parameter.value )
				.setWidth( '150px' )
				.onChange( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter instanceof FRAME.Parameters.Float ) {

			var parameterValue = new UI.Number()
				.setRange( parameter.min, parameter.max )
				.setValue( parameter.value )
				.setWidth( '150px' )
				.onChange( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter instanceof FRAME.Parameters.Vector2 ) {

			var vectorX = new UI.Number()
				.setValue( parameter.value[ 0 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 0 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorY = new UI.Number()
				.setValue( parameter.value[ 1 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 1 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( vectorX );
			parameterRow.add( vectorY );

		} else if ( parameter instanceof FRAME.Parameters.Vector3 ) {

			var vectorX = new UI.Number()
				.setValue( parameter.value[ 0 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 0 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorY = new UI.Number()
				.setValue( parameter.value[ 1 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 1 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorZ = new UI.Number()
				.setValue( parameter.value[ 2 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 2 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( vectorX );
			parameterRow.add( vectorY );
			parameterRow.add( vectorZ );

		} else if ( parameter instanceof FRAME.Parameters.String ) {

			var parameterValue = new UI.Input()
				.setValue( parameter.value )
				.setWidth( '150px' )
				.onKeyUp( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

		} else if ( parameter instanceof FRAME.Parameters.Color ) {

			var parameterValue = new UI.Color()
				.setHexValue( parameter.value )
				.setWidth( '150px' )
				.onChange( function () {

					parameter.value = this.getHexValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

		}

		return parameterRow;

	}

	function build() {

		container.clear();

		if ( selected === null ) return;

		values = {};

		// Name

		var row = new UI.Row();
		row.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
		container.add( row );

		var animationName = new UI.Input( selected.name )
		animationName.onChange( function () {

			selected.name = this.getValue();
			signals.animationRenamed.dispatch( selected );

		} );
		row.add( animationName );

		// Time

		var row = new UI.Row();
		row.add( new UI.Text( 'Time' ).setWidth( '90px' ) );
		container.add( row );

		var animationStart = new UI.Number( selected.start ).setWidth( '80px' );
		animationStart.onChange( function () {

			selected.start = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationStart );

		var animationEnd = new UI.Number( selected.end ).setWidth( '80px' );
		animationEnd.onChange( function () {

			selected.end = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationEnd );

		// Layer

		var row = new UI.Row();
		row.add( new UI.Text( 'Layer' ).setWidth( '90px' ) );
		container.add( row );

		var animationLayer = new UI.Integer( selected.layer ).setWidth( '80px' );
		animationLayer.onChange( function () {

			selected.layer = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationLayer );

		// Enabled

		var row = new UI.Row();
		row.add( new UI.Text( 'Enabled' ).setWidth( '90px' ) );
		container.add( row );

		var animationEnabled = new UI.Checkbox( selected.enabled )
		animationEnabled.onChange( function () {

			selected.enabled = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationEnabled );

		//

		container.add( new UI.HorizontalRule().setMargin( '20px 0px' ) );

		//

		var row = new UI.Row();
		row.add( new UI.Text( 'Effect' ).setWidth( '90px' ) );
		container.add( row );

		var effects = editor.effects;
		var options = {};

		for ( var i = 0; i < effects.length; i ++ ) {

			options[ i ] = effects[ i ].name;

		}

		var effectsSelect = new UI.Select().setWidth( '130px' );
		effectsSelect.setOptions( options ).setValue( effects.indexOf( selected.effect ) );
		effectsSelect.onChange( function () {

			editor.timeline.reset();
			selected.effect = editor.effects[ this.getValue() ];

			signals.animationModified.dispatch( selected );

			build();

		} );
		row.add( effectsSelect );

		var edit = new UI.Button( 'EDIT' ).setMarginLeft( '8px' );
		edit.onClick( function () {

			editor.selectEffect( selected.effect );

		} );
		row.add( edit );


		var row = new UI.Row();
		row.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
		container.add( row );

		var effectName = new UI.Input( selected.effect.name );
		effectName.onChange( function () {

			selected.effect.name = this.getValue();
			signals.effectRenamed.dispatch( selected.effect );

		} );
		row.add( effectName );

		//

		var parameters = selected.effect.program.parameters;

		for ( var key in parameters ) {

			container.add( createParameterRow( key, parameters[ key ] ) );

		}


	}

	//

	signals.editorCleared.add( function () {

		selected = null;
		build();

	} );

	signals.animationSelected.add( function ( animation ) {

		selected = animation;
		build();

	} );

	signals.effectCompiled.add( build );

	/*
	signals.timeChanged.add( function () {

		if ( selected !== null ) {

			for ( var key in values ) {

				values[ key ].setValue( selected.module.parameters[ key ].value );

			}

		}

	} );
	*/

	return container;

};
