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
                html: '组',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddGroup');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPlane',
                html: '平板',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPlane');
                }
            }, {
                xtype: 'div',
                id: 'mAddBox',
                html: '正方体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddBox');
                }
            }, {
                xtype: 'div',
                id: 'mAddCircle',
                html: '圆',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddCircle');
                }
            }, {
                xtype: 'div',
                id: 'mAddCylinder',
                html: '圆柱体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddCylinder');
                }
            }, {
                xtype: 'div',
                id: 'mAddSphere',
                html: '球体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSphere');
                }
            }, {
                xtype: 'div',
                id: 'mAddIcosahedron',
                html: '二十面体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddIcosahedron');
                }
            }, {
                xtype: 'div',
                id: 'mAddTorus',
                html: '轮胎',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTorus');
                }
            }, {
                xtype: 'div',
                id: 'mAddTorusKnot',
                html: '扭结',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTorusKnot');
                }
            }, {
                xtype: 'div',
                id: 'mAddTeaport',
                html: '茶壶',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddTeaport');
                }
            }, {
                xtype: 'div',
                id: 'mAddLathe',
                html: '花瓶',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddLathe');
                }
            }, {
                xtype: 'div',
                id: 'mAddSprite',
                html: '精灵',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSprite');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPointLight',
                html: '点光源',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPointLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddSpotLight',
                html: '聚光灯',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddSpotLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddDirectionalLight',
                html: '平行光源',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddDirectionalLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddHemisphereLight',
                html: '半球光',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddHemisphereLight');
                }
            }, {
                xtype: 'div',
                id: 'mAddAmbientLight',
                html: '环境光',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddAmbientLight');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mAddPerspectiveCamera',
                html: '透视相机',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddPerspectiveCamera');
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default AddMenu;