import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 动画菜单
 * @param {*} options 
 */
function AnimationMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

AnimationMenu.prototype = Object.create(Control.prototype);
AnimationMenu.prototype.constructor = AnimationMenu;

AnimationMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '动画'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mFire',
                xtype: 'div',
                cls: 'option',
                html: '火焰',
                onClick: function () {
                    _this.app.call('mAddFire', _this);
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default AnimationMenu;