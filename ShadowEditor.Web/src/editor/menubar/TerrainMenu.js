import UI from '../../ui/UI';

/**
 * 地形菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TerrainMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

TerrainMenu.prototype = Object.create(UI.Control.prototype);
TerrainMenu.prototype.constructor = TerrainMenu;

TerrainMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '地形'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                id: 'mPerson',
                xtype: 'div',
                cls: 'option',
                html: '生成地形',
                onClick: function () {

                }
            }, {
                id: 'mFire',
                xtype: 'div',
                cls: 'option',
                html: '抬高地形',
                onClick: function () {

                }
            }, {
                id: 'mSmoke',
                xtype: 'div',
                cls: 'option',
                html: '降低地形',
                onClick: function () {

                }
            }, {
                id: 'mMiku',
                xtype: 'div',
                cls: 'option',
                html: '批量种树',
                onClick: function () {

                }
            }]
        }]
    });

    container.render();
}

export default TerrainMenu;