import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 粒子菜单
 * @param {*} options 
 */
function ParticleMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

ParticleMenu.prototype = Object.create(Control.prototype);
ParticleMenu.prototype.constructor = ParticleMenu;

ParticleMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '粒子'
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

export default ParticleMenu;