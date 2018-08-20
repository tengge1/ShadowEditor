import UI from '../../ui/UI';
import ScenePanel from './ScenePanel';
import PropertyPanel from './PropertyPanel';
import ScriptPanel from './ScriptPanel';
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
    var editor = this.app.editor;
    var _this = this;

    function onClick(event) {
        _this.app.call('selectTab', _this, event.target.textContent);
    }

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
                onClick: onClick
            }, {
                xtype: 'text',
                id: 'historyTab',
                text: '历史',
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
        }, {
            xtype: 'div',
            id: 'histories',
            children: [
                new HistoryPanel({ app: this.app })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default Sidebar;