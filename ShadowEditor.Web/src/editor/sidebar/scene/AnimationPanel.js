import UI from '../../../ui/UI';

/**
 * 动画面板
 * @author tengge / https://github.com/tengge1
 */
function AnimationPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

AnimationPanel.prototype = Object.create(UI.Control.prototype);
AnimationPanel.prototype.constructor = AnimationPanel;

AnimationPanel.prototype.render = function () {
    var editor = this.app.editor;
    var history = editor.history;

    var _this = this;

    var ignoreObjectSelectedSignal = false;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{
            xtype: 'label',
            text: '动画'
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default AnimationPanel;