import UI from '../../ui/UI';

/**
 * 帮助菜单
 * @param {*} options 
 */
function HelpMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

HelpMenu.prototype = Object.create(UI.Control.prototype);
HelpMenu.prototype.constructor = HelpMenu;

HelpMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '帮助'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: '源码',
                onClick: () => {
                    window.open('https://github.com/tengge1/ShadowEditor', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '示例',
                onClick: () => {
                    window.open('https://github.com/tengge1/ShadowEditor-examples', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '文档',
                onClick: () => {
                    window.open('https://tengge1.github.io/ShadowEditor/docs/release/index.html', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: 'three.js',
                onClick: () => {
                    window.open('https://threejs.org/', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '关于',
                onClick: () => {
                    UI.alert(
                        `About`,
                        `Name: ShadowEditor<br />
                        Author: tengge<br />
                        License: MIT<br />
                        Thanks to three.js and everyone who helped us.`
                    );
                }
            }]
        }]
    });

    container.render();
};

export default HelpMenu;