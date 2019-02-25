import UI from '../../ui/UI';
import HierachyPanel from './HierachyPanel';
import ScriptPanel from './ScriptPanel';

/**
 * 侧边栏2
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
        cls: 'sidebar lsidebar',
        parent: this.parent,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                text: L_HIERACHY,
                cls: 'selected'
            }]
        }, { // 场景面板
            xtype: 'div',
            children: [
                new HierachyPanel({ app: this.app })
            ]
        }, {
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                text: L_SCRIPT,
                cls: 'selected'
            }]
        }, {
            xtype: 'div',
            children: [
                new ScriptPanel({ app: this.app })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default Sidebar;