import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 场景菜单
 * @param {*} options 
 */
function SceneMenu(options) {
    Control.call(this, options);
}

SceneMenu.prototype = Object.create(Control.prototype);
SceneMenu.prototype.constructor = SceneMenu;

SceneMenu.prototype.render = function () {
    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '场景'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mNewScene',
                text: '新建',
                cls: 'option',
                onClick: function () {
                    app.call('mNewScene');
                }
            }, {
                xtype: 'div',
                id: 'mLoadScene',
                text: '载入',
                cls: 'option',
                onClick: function () {
                    app.call('mLoadScene');
                }
            }, {
                xtype: 'div',
                id: 'mSaveScene',
                text: '保存',
                cls: 'options',
                onClick: function () {
                    app.call('mSaveScene');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mPublishScene',
                text: '发布',
                cls: 'option',
                onClick: function () {
                    app.call('mPublishScene');
                }
            }]
        }]
    };
}

XType.add('sceneMenu', SceneMenu);

export default SceneMenu;