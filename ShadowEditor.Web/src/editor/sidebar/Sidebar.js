import UI from '../../ui/UI';
import HierachyPanel from './HierachyPanel';
import PropertyPanel from './PropertyPanel';
import ScriptPanel from './ScriptPanel';
import ComponentPanel from './ComponentPanel';
import AnimationPanel from './AnimationPanel';
import HistoryPanel from './HistoryPanel';

/**
 * 侧边栏
 * @author mrdoob / http://mrdoob.com/
 */
function Sidebar(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

Sidebar.prototype = Object.create(UI.Control.prototype);
Sidebar.prototype.constructor = Sidebar;

Sidebar.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'sidebar',
        cls: 'sidebar',
        parent: this.app.container,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'sceneTab',
                text: '场景',
                onClick: () => {
                    this.selectTab('场景');
                }
            }, {
                xtype: 'text',
                id: 'componentTab',
                text: '组件',
                onClick: () => {
                    this.selectTab('组件');
                }
            }, {
                xtype: 'text',
                id: 'animationTab',
                text: '动画',
                onClick: () => {
                    this.selectTab('动画');
                }
            }, {
                xtype: 'text',
                id: 'historyTab',
                text: '历史',
                onClick: () => {
                    this.selectTab('历史');
                }
            }]
        }, { // 场景面板
            xtype: 'div',
            id: 'scenePanel',
            children: [
                new HierachyPanel({ app: this.app }),
                new PropertyPanel({ app: this.app }),
                new ScriptPanel({ app: this.app })
            ]
        }, { // 组件面板
            xtype: 'div',
            id: 'componentPanel',
            children: [
                new ComponentPanel({ app: this.app }),
            ]
        }, {
            xtype: 'div',
            id: 'animationPanel',
            children: [
                new AnimationPanel({ app: this.app })
            ]
        }, { // 历史纪录面板
            xtype: 'div',
            id: 'historyPanel',
            children: [
                new HistoryPanel({ app: this.app })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, () => {
        this.selectTab('场景');
    });
};

Sidebar.prototype.selectTab = function (tabName) {
    const sceneTab = UI.get('sceneTab');
    const componentTab = UI.get('componentTab');
    const animationTab = UI.get('animationTab');
    const historyTab = UI.get('historyTab');

    const scenePanel = UI.get('scenePanel');
    const componentPanel = UI.get('componentPanel');
    const animationPanel = UI.get('animationPanel');
    const historyPanel = UI.get('historyPanel');

    sceneTab.dom.className = '';
    componentTab.dom.className = '';
    animationTab.dom.className = '';
    historyTab.dom.className = '';

    scenePanel.dom.style.display = 'none';
    componentPanel.dom.style.display = 'none';
    animationPanel.dom.style.display = 'none';
    historyPanel.dom.style.display = 'none';

    switch (tabName) {
        case '场景':
            sceneTab.dom.className = 'selected';
            scenePanel.dom.style.display = '';
            break;
        case '组件':
            componentTab.dom.className = 'selected';
            componentPanel.dom.style.display = '';
            break;
        case '动画':
            animationTab.dom.className = 'selected';
            animationPanel.dom.style.display = '';
            break;
        case '历史':
            historyTab.dom.className = 'selected';
            historyPanel.dom.style.display = '';
            break;
    }
};

export default Sidebar;