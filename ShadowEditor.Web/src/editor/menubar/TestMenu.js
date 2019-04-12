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
                html: 'Hello World',
                onClick: this.hello.bind(this),
            }]
        }]
    });

    container.render();
};

TestMenu.prototype.showWin = function () {
    if (this.win === undefined) {
        this.win = UI.create({
            xtype: 'window',
            title: 'Data Visualization',
            id: 'dataVisualWin',
            scope: this.id,
            width: '800px',
            height: '500px',
            shade: false,
            containerStyle: {
                display: 'flex',
                flexDirection: 'column',
            },
            bodyStyle: {
                padding: 0,
            },
            children: [{
                xtype: 'div',
                id: 'container',
                scope: this.id,
                style: {
                    width: '100%',
                    height: '100%',
                },
            }]
        });
        this.win.render();
    }

    this.win.show();
};

TestMenu.prototype.clearContent = function () {
    var container = UI.get('container', this.id);

    while (container.dom.children.length) {
        container.dom.removeChild(container.dom.children[0]);
    }
};

TestMenu.prototype.hello = function () {
    this.showWin();
    this.clearContent();

    var container = UI.get('container', this.id);

    var svg = d3.select(container.dom)
        .append('svg')
        .attr('width', 500)
        .attr('height', 500);

    var circle = svg.append('circle')
        .attr('cx', 100)
        .attr('cy', 100)
        .attr('r', 50)
        .attr('fill', '#f00');
};

export default TestMenu;