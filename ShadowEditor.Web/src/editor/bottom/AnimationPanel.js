import UI from '../../ui/UI';

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
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'animation-panel',
        children: [{
            xtype: 'div',
            cls: 'controls',
            children: [{
                xtype: 'iconbutton',
                icon: 'icon-backward'
            }, {
                xtype: 'iconbutton',
                icon: 'icon-play'
            }, {
                xtype: 'iconbutton',
                icon: 'icon-forward'
            }, {
                xtype: 'iconbutton',
                icon: 'icon-stop'
            }]
        }, {
            xtype: 'canvas',
            cls: 'timeline',
            id: 'timeline'
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default AnimationPanel;