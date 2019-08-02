import UI from '../../ui/UI';
import BasicAnimationComponent from '../../component/animation/BasicAnimationComponent';
import TweenAnimationComponent from '../../component/animation/TweenAnimationComponent';

/**
 * 动画面板
 */
function AnimationPanel(options) {
    UI.Control.call(this, options);
};

AnimationPanel.prototype = Object.create(UI.Control.prototype);
AnimationPanel.prototype.constructor = AnimationPanel;

AnimationPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        children: [
            new BasicAnimationComponent({ app: app }),
            new TweenAnimationComponent({ app: app }),
        ]
    };

    var control = UI.create(data);
    control.render();
};

export default AnimationPanel;