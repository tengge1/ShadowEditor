import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 视图菜单
 * @param {*} options 
 */
function ViewMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

ViewMenu.prototype = Object.create(Control.prototype);
ViewMenu.prototype.constructor = ViewMenu;

ViewMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
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

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default ViewMenu;