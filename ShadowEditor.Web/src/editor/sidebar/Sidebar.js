import UI from '../../ui/UI';
import PropertyPanel from './scene/PropertyPanel';
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
        parent: this.app.container,
        cls: 'sidebar',
        children: [{
            xtype: 'div',
            cls: 'tabs',
            style: {
                position: 'sticky',
                top: 0,
                zIndex: 10
            },
            children: [{
                xtype: 'text',
                id: 'propertyTab',
                text: '属性',
                onClick: () => {
                    this.selectTab('property');
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
        }, {
            xtype: 'div',
            id: 'propertyPanel',
            children: [
                new PropertyPanel({ app: this.app })
            ]
        }, {
            xtype: 'div',
            id: 'settingPanel',
            children: [
                new SettingPanel({ app: this.app })
            ]
        }, {
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
        this.selectTab('property');
    });
};

Sidebar.prototype.selectTab = function (tabName) {
    const propertyTab = UI.get('propertyTab');
    const settingTab = UI.get('settingTab');
    const historyTab = UI.get('historyTab');
    const logTab = UI.get('logTab');

    const propertyPanel = UI.get('propertyPanel');
    const settingPanel = UI.get('settingPanel');
    const historyPanel = UI.get('historyPanel');
    const logPanel = UI.get('logPanel');

    propertyTab.dom.className = '';
    settingTab.dom.className = '';
    historyTab.dom.className = '';
    logTab.dom.className = '';

    propertyPanel.dom.style.display = 'none';
    settingPanel.dom.style.display = 'none';
    historyPanel.dom.style.display = 'none';
    logPanel.dom.style.display = 'none';

    switch (tabName) {
        case 'property':
            propertyTab.dom.className = 'selected';
            propertyPanel.dom.style.display = '';
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