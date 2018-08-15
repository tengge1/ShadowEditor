import UI from '../../ui/UI';

/**
 * 物体菜单
 * @param {*} options 
 */
function PhysicsMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

PhysicsMenu.prototype = Object.create(UI.Control.prototype);
PhysicsMenu.prototype.constructor = PhysicsMenu;

PhysicsMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '物理'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: '添加平板',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPhysicsPlane', _this);
                }
            }, {
                xtype: 'div',
                html: '添加布料',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPhysicsCloth', _this);
                }
            }]
        }]
    });

    container.render();
}

export default PhysicsMenu;