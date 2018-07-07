import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 示例菜单
 * @param {*} options 
 */
function ExampleMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

ExampleMenu.prototype = Object.create(Control.prototype);
ExampleMenu.prototype.constructor = ExampleMenu;

ExampleMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '示例'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mArkanoid',
                xtype: 'div',
                cls: 'option',
                html: '打砖块',
                onClick: function () {
                    _this.app.call('mArkanoid');
                }
            }, {
                id: 'mCamera',
                xtype: 'div',
                cls: 'option',
                html: '相机',
                onClick: function () {
                    _this.app.call('mCamera');
                }
            }, {
                id: 'mParticles',
                xtype: 'div',
                cls: 'option',
                html: '粒子',
                onClick: function () {
                    _this.app.call('mParticles');
                }
            }, {
                id: 'mPong',
                xtype: 'div',
                cls: 'option',
                html: '乒乓球',
                onClick: function () {
                    _this.app.call('mPong');
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default ExampleMenu;