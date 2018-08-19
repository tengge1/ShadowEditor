import UI from '../../ui/UI';

/**
 * 工具菜单
 * @param {*} options 
 */
function ToolMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ToolMenu.prototype = Object.create(UI.Control.prototype);
ToolMenu.prototype.constructor = ToolMenu;

ToolMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '工具'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mSourceCode',
                xtype: 'div',
                cls: 'option',
                html: '配置',
                onClick: function () {

                }
            }]
        }]
    });

    container.render();
}

export default ToolMenu;