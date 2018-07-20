import UI from '../../ui/UI';

/**
 * 启动菜单
 * @param {*} options 
 */
function PlayMenu(options) {
    UI.Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

PlayMenu.prototype = Object.create(UI.Control.prototype);
PlayMenu.prototype.constructor = PlayMenu;

PlayMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
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

    var control = UI.create(data);
    control.render();
}

export default PlayMenu;