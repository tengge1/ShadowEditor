import UI from '../../ui/UI';
import Sidebar from '../../visual/demo/Sidebar';
import Panel from '../../visual/demo/Panel';
import BarChart from '../../visual/demo/BarChart';

/**
 * 数据可视化菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function VisualMenu(options) {
    UI.Control.call(this, options);
    app = options.app;
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
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_BAR_CHART,
                onClick: this.addBarChart.bind(this),
            }]
        }]
    });

    container.render();
};

// ------------------------- 侧边栏 ------------------------------------------

VisualMenu.prototype.addSidebar = function () {
    var control = new Sidebar({
        parent: app.editor.svg,
    });
    control.render();
};

// ------------------------------ 面板 ----------------------------------------

VisualMenu.prototype.addPanel = function () {
    var control = new Panel({
        parent: app.editor.svg,
    });
    control.render();
};

// ---------------------------- 条形图 ------------------------------------------

VisualMenu.prototype.addBarChart = function () {
    var control = new BarChart({
        parent: app.editor.svg,
    });
    control.render();
};

export default VisualMenu;