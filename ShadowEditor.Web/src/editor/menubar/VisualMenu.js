import UI from '../../ui/UI';
import Sidebar from '../../visual/Sidebar';
import Panel from '../../visual/Panel';

/**
 * 数据可视化菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function VisualMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

VisualMenu.prototype = Object.create(UI.Control.prototype);
VisualMenu.prototype.constructor = VisualMenu;

VisualMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_VISUAL
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: L_SIDEBAR,
                onClick: this.addSidebar.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_PANEL,
                onClick: this.addPanel.bind(this),
            }]
        }]
    });

    container.render();

    // TODO: 为了方便开发，需要删除
    //this.app.on(`appStarted.${this.id}`, this.addSidebar.bind(this));
};

// ------------------------- 侧边栏 ------------------------------------------

VisualMenu.prototype.addSidebar = function () {
    var control = new Sidebar({
        parent: this.app.editor.svg,
    });
    control.render();
};

// ------------------------------ 面板 ----------------------------------------

VisualMenu.prototype.addPanel = function () {
    var control = new Panel({
        parent: this.app.editor.svg,
    });
    control.render();
};

export default VisualMenu;