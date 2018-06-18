import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function AnimationPanel(editor) {
	var options = {};
	var possibleAnimations = {};

	var container = new UI.Panel();
	container.setDisplay('none');

	container.add(new UI.Text('动画'));
	container.add(new UI.Break());
	container.add(new UI.Break());

	var animationsRow = new UI.Row();
	container.add(animationsRow);

	return container;

};

export default AnimationPanel;