import UI from '../../ui/UI';
import ObjectLoader from '../../loader/ObjectLoader';
import AddObjectCommand from '../../command/AddObjectCommand';
import LolModel from '../../lol/Model';

var ID = 1;

/**
 * 动画菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AnimationMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

AnimationMenu.prototype = Object.create(UI.Control.prototype);
AnimationMenu.prototype.constructor = AnimationMenu;

AnimationMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '测试'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: '初音未来',
                onClick: () => {
                    this.app.call('mAddMiku', this);
                }
            }]
        }]
    });

    container.render();
}

export default AnimationMenu;