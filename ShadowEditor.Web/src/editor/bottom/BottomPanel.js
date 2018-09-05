import Control from '../../ui/Control';

/**
 * 底部面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function BottomPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

BottomPanel.prototype = Object.create(Control.prototype);
BottomPanel.prototype.constructor = BottomPanel;

BottomPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        cls: 'sidebar bottomPanel',
        parent: this.app.container,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'animationTab',
                text: '动画',
                onClick: () => {
                    this.selectTab('animation');
                }
            }, {
                xtype: 'text',
                id: 'logTab',
                text: '日志',
                onClick: () => {
                    this.selectTab('log');
                }
            }]
        }, {
            xtype: 'div',
            id: 'animationPanel',
            children: [

            ]
        }, {
            xtype: 'div',
            id: 'logPanel',
            children: [

            ]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, () => {
        this.selectTab('animation');
    });
};

BottomPanel.prototype.selectTab = function (tabName) {
    const animationTab = UI.get('animationTab');
    const logTab = UI.get('logTab');

    const animationPanel = UI.get('animationPanel');
    const logPanel = UI.get('logPanel');

    animationTab.dom.className = '';
    logTab.dom.className = '';

    animationPanel.dom.style.display = 'none';
    logPanel.dom.style.display = 'none';

    switch (tabName) {
        case 'animation':
            animationTab.dom.className = 'selected';
            animationPanel.dom.style.display = '';
            break;
        case 'log':
            logTab.dom.className = 'selected';
            logPanel.dom.style.display = '';
            break;
    }
};

export default BottomPanel;