import UI from '../../ui/UI';
import HierachyPanel from './scene/HierachyPanel';
import PropertyPanel from './scene/PropertyPanel';
import ScriptPanel from './scene/ScriptPanel';
import SettingPanel from './SettingPanel';
import HistoryPanel from './HistoryPanel';
import LogPanel from './LogPanel';

/**
 * 侧边栏
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
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
                    this.selectTab('scene');
                }
            }, {
                xtype: 'text',
                id: 'settingTab',
                text: '设置',
                onClick: () => {
                    this.selectTab('setting');
                }
            }, {
                xtype: 'text',
                id: 'historyTab',
                text: '历史',
                onClick: () => {
                    this.selectTab('history');
                }
            }, {
                xtype: 'text',
                id: 'logTab',
                text: '日志',
                onClick: () => {
                    this.selectTab('log');
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
        }, { // 设置面板
            xtype: 'div',
            id: 'settingPanel',
            children: [
                new SettingPanel({ app: this.app })
            ]
        }, { // 历史纪录面板
            xtype: 'div',
            id: 'historyPanel',
            children: [
                new HistoryPanel({ app: this.app })
            ]
        }, {
            xtype: 'div',
            id: 'logPanel',
            children: [
                new LogPanel({ app: this.app })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, () => {
        this.selectTab('scene');
    });
};

Sidebar.prototype.selectTab = function (tabName) {
    const sceneTab = UI.get('sceneTab');
    const settingTab = UI.get('settingTab');
    const historyTab = UI.get('historyTab');
    const logTab = UI.get('logTab');

    const scenePanel = UI.get('scenePanel');
    const settingPanel = UI.get('settingPanel');
    const historyPanel = UI.get('historyPanel');
    const logPanel = UI.get('logPanel');

    sceneTab.dom.className = '';
    settingTab.dom.className = '';
    historyTab.dom.className = '';
    logTab.dom.className = '';

    scenePanel.dom.style.display = 'none';
    settingPanel.dom.style.display = 'none';
    historyPanel.dom.style.display = 'none';
    logPanel.dom.style.display = 'none';

    switch (tabName) {
        case 'scene':
            sceneTab.dom.className = 'selected';
            scenePanel.dom.style.display = '';
            break;
        case 'setting':
            settingTab.dom.className = 'selected';
            settingPanel.dom.style.display = '';
            break;
        case 'history':
            historyTab.dom.className = 'selected';
            historyPanel.dom.style.display = '';
            break;
        case 'log':
            logTab.dom.className = 'selected';
            logPanel.dom.style.display = '';
            break;
    }

    this.app.call('selectTab', this, tabName);
};

export default Sidebar;