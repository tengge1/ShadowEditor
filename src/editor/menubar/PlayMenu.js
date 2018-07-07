import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 启动菜单
 * @param {*} options 
 */
function PlayMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

PlayMenu.prototype = Object.create(Control.prototype);
PlayMenu.prototype.constructor = PlayMenu;

PlayMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            id: 'mPlay',
            xtype: 'div',
            cls: 'title',
            html: '启动',
            onClick: function () {
                _this.app.call('mPlay');
            }
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default PlayMenu;