import UI from '../../ui/UI';

/**
 * 测试菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TestMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

TestMenu.prototype = Object.create(UI.Control.prototype);
TestMenu.prototype.constructor = TestMenu;

TestMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: 'Test'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: 'd3.js',
                onClick: this.helloWorld.bind(this),
            }]
        }]
    });

    container.render();
};

TestMenu.prototype.helloWorld = function () {
    if(this.win === undefined) {
        this.win = UI.create({
            xtype: 'window'
        });
        this.win.render();
    }

    this.win.show();
};

export default TestMenu;