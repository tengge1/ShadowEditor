import UI from '../ui/UI';

/**
 * 动画菜单
 * @param {*} options 
 */
function AnimationMenu(options) {
    UI.Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

AnimationMenu.prototype = Object.create(UI.Control.prototype);
AnimationMenu.prototype.constructor = AnimationMenu;

AnimationMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '动画'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mPerson',
                xtype: 'div',
                cls: 'option',
                html: '人',
                onClick: function () {
                    _this.app.call('mAddPerson', _this);
                }
            }, {
                id: 'mFire',
                xtype: 'div',
                cls: 'option',
                html: '火焰',
                onClick: function () {
                    _this.app.call('mAddFire', _this);
                }
            }, {
                id: 'mSmoke',
                xtype: 'div',
                cls: 'option',
                html: '烟',
                onClick: function () {
                    _this.app.call('mAddSmoke', _this);
                }
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
}

export default AnimationMenu;