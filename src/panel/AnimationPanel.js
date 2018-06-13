import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';
import Text from '../ui/Text';
import Boolean from '../ui/Boolean';
import Break from '../ui/Break';
import Button from '../ui/Button';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function AnimationPanel(editor) {

	var signals = editor.signals;

	var options = {};
	var possibleAnimations = {};

	var container = new Panel();
	container.setDisplay('none');

	container.add(new Text('动画'));
	container.add(new Break());
	container.add(new Break());

	var animationsRow = new Row();
	container.add(animationsRow);

    /*

	var animations = {};

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.SkinnedMesh ) {

				var material = child.material;

				if ( material instanceof THREE.MultiMaterial ) {

					for ( var i = 0; i < material.materials.length; i ++ ) {

						material.materials[ i ].skinning = true;

					}

				} else {

					child.material.skinning = true;

				}

				animations[ child.id ] = new THREE.Animation( child, child.geometry.animation );

			} else if ( child instanceof THREE.MorphAnimMesh ) {

				var animation = new THREE.MorphAnimation( child );
				animation.duration = 30;

				// temporal hack for THREE.AnimationHandler
				animation._play = animation.play;
				animation.play = function () {
					this._play();
					THREE.AnimationHandler.play( this );
				};
				animation.resetBlendWeights = function () {};
				animation.stop = function () {
					this.pause();
					THREE.AnimationHandler.stop( this );
				};

				animations[ child.id ] = animation;

			}

		} );

	} );

	signals.objectSelected.add( function ( object ) {

		container.setDisplay( 'none' );

		if ( object instanceof THREE.SkinnedMesh || object instanceof THREE.MorphAnimMesh ) {

			animationsRow.clear();

			var animation = animations[ object.id ];

			var playButton = new Button( 'Play' ).onClick( function () {

				animation.play();

			} );
			animationsRow.add( playButton );

			var pauseButton = new Button( 'Stop' ).onClick( function () {

				animation.stop();

			} );
			animationsRow.add( pauseButton );

			container.setDisplay( 'block' );

		}

	} );

	*/

	return container;

};

export default AnimationPanel;