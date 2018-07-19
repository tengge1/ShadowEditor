import UI from '../ui/UI';

/**
 * 视图菜单
 * @param {*} options 
 */
function ViewMenu(options) {
    UI.Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

ViewMenu.prototype = Object.create(UI.Control.prototype);
ViewMenu.prototype.constructor = ViewMenu;

ViewMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '视图'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mVRMode',
                xtype: 'div',
                cls: 'option',
                html: 'VR模式',
                onClick: function () {
                    _this.app.call('mVRMode');
                }
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
}

export default ViewMenu;