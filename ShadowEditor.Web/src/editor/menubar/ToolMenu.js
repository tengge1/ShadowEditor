import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';
import Ajax from '../../utils/Ajax';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ToolMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ToolMenu.prototype = Object.create(UI.Control.prototype);
ToolMenu.prototype.constructor = ToolMenu;

ToolMenu.prototype.render = function () {
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
                xtype: 'div',
                html: '整理贴图',
                cls: 'option',
                onClick: this.onArrangeMap.bind(this)
            }]
        }]
    });

    container.render();
}

ToolMenu.prototype.onArrangeMap = function () {
    UI.msg('整理贴图');
};

export default ToolMenu;