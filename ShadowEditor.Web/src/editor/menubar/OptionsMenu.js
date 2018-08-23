import UI from '../../ui/UI';

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
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '选项'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: '外观',
                onClick: () => {
                    this.app.call('mSurfaceOptions', this);
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '场景',
                onClick: () => {
                    this.app.call('mSceneOptions', this);
                }
            }, {
                xtype: 'div',
                cls: 'option',
                html: '渲染器',
                onClick: () => {
                    this.app.call('mRendererOptions', this);
                }
            }]
        }]
    });

    container.render();
}

export default OptionsMenu;