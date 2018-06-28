import UI2 from '../ui2/UI';

/**
 * 动画侧边栏
 * @author mrdoob / http://mrdoob.com/
 */
function AnimationPanel(app) {
	var options = {};
	var possibleAnimations = {};

	var container = new UI2.Div();
	container.setDisplay('none');

	container.add(new UI.Text('动画'));
	container.add(new UI.Break());
	container.add(new UI.Break());

	var animationsRow = new UI.Row();
	container.add(animationsRow);

	return container;
};

export default AnimationPanel;