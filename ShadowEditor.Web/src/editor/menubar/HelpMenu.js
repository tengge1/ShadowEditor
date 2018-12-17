import UI from '../../ui/UI';

/**
 * 帮助菜单
 * @author tengge / https://github.com/tengge1
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
                    window.open('https://tengge1.github.io/ShadowEditor/', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '关于',
                onClick: () => {
                    UI.alert(
                        `关于`,
                        `名称：ShadowEditor<br />
                        作者：tengge<br />
                        授权：MIT<br />
                        源码1：https://github.com/tengge1/ShadowEditor<br />
                        源码2：https://gitee.com/tengge1/ShadowEditor`
                    );
                }
            }]
        }]
    });

    container.render();
};

export default HelpMenu;