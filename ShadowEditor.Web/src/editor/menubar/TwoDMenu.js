import UI from '../../ui/UI';
import Button from '../../visual/Button';

/**
 * 二维菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TwoDMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

TwoDMenu.prototype = Object.create(UI.Control.prototype);
TwoDMenu.prototype.constructor = TwoDMenu;

TwoDMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_TWO_D
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: L_BUTTON,
                onClick: this.addButton.bind(this),
            }]
        }]
    });

    container.render();
};

// ------------------------------ 按钮 --------------------------------

TwoDMenu.prototype.addButton = function () {
    new Button(this.app.editor.svg);
};

export default TwoDMenu;