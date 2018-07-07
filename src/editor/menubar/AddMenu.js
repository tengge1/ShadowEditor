import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 添加菜单
 * @param {*} options 
 */
function AddMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

AddMenu.prototype = Object.create(Control.prototype);
AddMenu.prototype.constructor = AddMenu;

AddMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '添加'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mAddGroup',
                text: '组',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddGroup');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPlane',
                text: '平板',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPlane');
                }
            }, {
                xtype: 'div',
                id: 'mAddBox',
                text: '正方体',
                cls: 'options',
                onClick: function () {
                    _this.app.call('mAddBox');
                }
            }, {
                xtype: 'div',
                id: 'mAddCircle',
                text: '圆',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddCircle');
                }
            }, {
                xtype: 'div',
                id: 'mAddCylinder',
                text: '圆柱体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddCylinder');
                }
            }, {
                xtype: 'div',
                id: 'mAddSphere',
                text: '球体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSphere');
                }
            }, {
                xtype: 'div',
                id: 'mAddIcosahedron',
                text: '二十面体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddIcosahedron');
                }
            }, {
                xtype: 'div',
                id: 'mAddTorus',
                text: '轮胎',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTorus');
                }
            }, {
                xtype: 'div',
                id: 'mAddTorusKnot',
                text: '扭结',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTorusKnot');
                }
            }, {
                xtype: 'div',
                id: 'mAddTeaport',
                text: '茶壶',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTeaport');
                }
            }, {
                xtype: 'div',
                id: 'mAddLathe',
                text: '花瓶',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddLathe');
                }
            }, {
                xtype: 'div',
                id: 'mAddSprite',
                text: '精灵',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSprite');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPointLight',
                text: '点光源',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPointLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddSpotLight',
                text: '聚光灯',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSpotLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddDirectionalLight',
                text: '平行光源',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddDirectionalLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddHemisphereLight',
                text: '半球光',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddHemisphereLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddAmbientLight',
                text: '环境光',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddAmbientLight');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPerspectiveCamera',
                text: '透视相机',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPerspectiveCamera');
                }
            }]
        }]
    };

    this.dom = XType.create(data);
    this.parent.appendChild(this.dom);
}

export default AddMenu;