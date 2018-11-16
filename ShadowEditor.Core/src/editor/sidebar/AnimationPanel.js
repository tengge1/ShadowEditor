import { UI } from '../../third_party';
import BasicAnimationComponent from '../../component/animation/BasicAnimationComponent';
import TweenAnimationComponent from '../../component/animation/TweenAnimationComponent';

/**
 * 动画面板
 */
function AnimationPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

AnimationPanel.prototype = Object.create(UI.Control.prototype);
AnimationPanel.prototype.constructor = AnimationPanel;

AnimationPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        children: [
            new BasicAnimationComponent({ app: this.app }),
            new TweenAnimationComponent({ app: this.app }),
        ]
    };

    var control = UI.create(data);
    control.render();
};

export default AnimationPanel;