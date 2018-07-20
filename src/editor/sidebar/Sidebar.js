import UI from '../../ui/UI';
import ScenePanel from './ScenePanel';
import PropertyPanel from './PropertyPanel';
import ScriptPanel from './ScriptPanel';
import ProjectPanel from './ProjectPanel';
import SettingPanel from './SettingPanel';
import HistoryPanel from './HistoryPanel';

/**
 * 侧边栏
 * @author mrdoob / http://mrdoob.com/
 */
function Sidebar(app) {
    UI.Control.call(this, { parent: app.container });
    this.app = app;
};

Sidebar.prototype = Object.create(UI.Control.prototype);
Sidebar.prototype.constructor = Sidebar;

Sidebar.prototype.render = function () {
    var editor = this.app.editor;
    var _this = this;

    function onClick(event) {
        _this.app.call('selectTab', _this, event.target.textContent);
    }

    var data = {
        xtype: 'div',
        id: 'sidebar',
        parent: this.app.container,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'sceneTab',
                text: '场景',
                onClick: onClick
            }, {
                xtype: 'text',
                id: 'projectTab',
                text: '工程',
                onClick: onClick
            }, {
                xtype: 'text',
                id: 'settingsTab',
                text: '设置',
                onClick: onClick
            }]
        }, { // scene
            xtype: 'div',
            id: 'scene',
            children: [
                new ScenePanel({ app: this.app }),
                new PropertyPanel({ app: this.app }),
                new ScriptPanel({ app: this.app })
            ]
        }, { // project
            xtype: 'div',
            id: 'project',
            children: [
                new ProjectPanel({ app: this.app })
            ]
        }, {
            xtype: 'div',
            id: 'settings',
            children: [
                new SettingPanel({ app: this.app }),
                new HistoryPanel({ app: this.app })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default Sidebar;