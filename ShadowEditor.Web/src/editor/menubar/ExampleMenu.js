import UI from '../../ui/UI';

/**
 * 示例菜单
 * @param {*} options 
 */
function ExampleMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ExampleMenu.prototype = Object.create(UI.Control.prototype);
ExampleMenu.prototype.constructor = ExampleMenu;

ExampleMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
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
    });

    container.render();
}

export default ExampleMenu;