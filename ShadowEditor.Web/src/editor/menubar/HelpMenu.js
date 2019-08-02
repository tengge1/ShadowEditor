import UI from '../../ui/UI';

/**
 * 帮助菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HelpMenu(options) {
    UI.Control.call(this, options);
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
            html: L_HELP
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: L_SOURCE,
                onClick: () => {
                    window.open('https://github.com/tengge1/ShadowEditor', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_EXAMPLES,
                onClick: () => {
                    window.open('https://github.com/tengge1/ShadowEditor-examples', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_DOCUMENTS,
                onClick: () => {
                    window.open('https://tengge1.github.io/ShadowEditor/', '_blank');
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_ABOUT,
                onClick: () => {
                    UI.alert(
                        L_ABOUT,
                        `${L_NAME}: ShadowEditor<br />
                        ${L_AUTHOR}: tengge<br />
                        ${L_LISENSE}: MIT<br />
                        ${L_SOURCE}1: https://github.com/tengge1/ShadowEditor<br />
                        ${L_SOURCE}2: https://gitee.com/tengge1/ShadowEditor`
                    );
                }
            }]
        }]
    });

    container.render();
};

export default HelpMenu;