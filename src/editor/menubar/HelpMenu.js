import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 帮助菜单
 * @param {*} options 
 */
function HelpMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

HelpMenu.prototype = Object.create(Control.prototype);
HelpMenu.prototype.constructor = HelpMenu;

HelpMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '帮助'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mSourceCode',
                xtype: 'div',
                cls: 'option',
                html: '源码',
                onClick: function () {
                    _this.app.call('mSourceCode');
                }
            }, {
                id: 'mAbout',
                xtype: 'div',
                cls: 'option',
                html: '关于',
                onClick: function () {
                    _this.app.call('mAbout');
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default HelpMenu;