import UI from '../../ui/UI';
import DataSourceManageWindow from '../window/DataSourceManageWindow';
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
            children: [
                //     {
                //     xtype: 'div',
                //     cls: 'option',
                //     html: L_DATA_SOURCE_MANAGE,
                //     onClick: this.manageDataSource.bind(this),
                // }, 
                {
                    xtype: 'div',
                    cls: 'option',
                    html: L_PANEL,
                    onClick: this.addPanel.bind(this),
                }]
        }]
    });

    container.render();
};

// ------------------------- 数据源管理 ------------------------------------------

VisualMenu.prototype.manageDataSource = function () {
    UI.msg('Test');
    // if (this.dataSourceManageWin === undefined) {
    //     this.dataSourceManageWin = new DataSourceManageWindow({
    //         app: this.app,
    //     });
    //     this.dataSourceManageWin.render();
    // }

    // this.dataSourceManageWin.show();
};

// ------------------------------ 面板 ----------------------------------------

VisualMenu.prototype.addPanel = function () {
    var panel = new Panel({
        parent: this.app.editor.svg,
    });
    panel.render();
};

export default VisualMenu;