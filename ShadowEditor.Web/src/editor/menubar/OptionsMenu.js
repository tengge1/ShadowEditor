import UI from '../../ui/UI';
import OptionsWindow from '../window/OptionsWindow';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OptionsMenu(options) {
    UI.Control.call(this, options);
    app = options.app;
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
                html: L_HELPERS,
                onClick: this.onHelperOptions.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_RENDERER,
                onClick: this.onRendererOptions.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_FILTER,
                onClick: this.onFilterOptions.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------------- 外观选项 ---------------------------------------

OptionsMenu.prototype.onSurfaceOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({
            app: app
        });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_SURFACE);
};

// ---------------------------------- 渲染器选项 -------------------------------------

OptionsMenu.prototype.onRendererOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({
            app: app
        });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_RENDERER);
};

// ------------------------------- 帮助器选项 -----------------------------------------

OptionsMenu.prototype.onHelperOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({
            app: app
        });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_HELPERS);
};

// ------------------------------ 滤镜选项 ---------------------------------------------

OptionsMenu.prototype.onFilterOptions = function () {
    if (this.optionsWindow === undefined) {
        this.optionsWindow = new OptionsWindow({
            app: app
        });
        this.optionsWindow.render();
    }
    this.optionsWindow.show();
    this.optionsWindow.changeTab(L_FILTER);
};

export default OptionsMenu;