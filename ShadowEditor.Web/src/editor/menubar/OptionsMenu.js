import UI from '../../ui/UI';
import OptionsWindow from '../window/OptionsWindow';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OptionsMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

OptionsMenu.prototype = Object.create(UI.Control.prototype);
OptionsMenu.prototype.constructor = OptionsMenu;

OptionsMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_OPTIONS
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: L_SURFACE,
                onClick: this.onSurfaceOptions.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_SCENE,
                onClick: this.onSceneOptions.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_RENDERER,
                onClick: this.onRendererOptions.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------------- 外观选项 ---------------------------------------

OptionsMenu.prototype.onSurfaceOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({ app: this.app });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_OPTIONS);
};

// ---------------------------------- 场景选项 ---------------------------------------

OptionsMenu.prototype.onSceneOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({ app: this.app });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_SURFACE);
};

// ---------------------------------- 渲染器选项 -------------------------------------

OptionsMenu.prototype.onRendererOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({ app: this.app });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_RENDERER);
};

export default OptionsMenu;