import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 资源菜单
 * @param {*} options 
 */
function AssetMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

AssetMenu.prototype = Object.create(Control.prototype);
AssetMenu.prototype.constructor = AssetMenu;

AssetMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '资源'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mImportAsset',
                html: '导入',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mImportAsset');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mExportGeometry',
                html: '导出几何体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportGeometry');
                }
            }, {
                xtype: 'div',
                id: 'mExportObject',
                html: '导出物体',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportObject');
                }
            }, {
                xtype: 'div',
                id: 'mExportScene',
                html: '导出场景',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportScene');
                }
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                id: 'mExportGLTF',
                html: '导出gltf文件',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportGLTF');
                }
            }, {
                xtype: 'div',
                id: 'mExportMMD',
                html: '导出mmd文件',
                cls: 'option inactive',
                onClick: function () {
                    _this.app.call('mExportMMD');
                }
            }, {
                xtype: 'div',
                id: 'mExportOBJ',
                html: '导出obj文件',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportOBJ');
                }
            }, {
                xtype: 'div',
                id: 'mExportPLY',
                html: '导出ply文件',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportPLY');
                }
            }, {
                xtype: 'div',
                id: 'mExportSTLB',
                html: '导出stl二进制文件',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportSTLB');
                }
            }, {
                xtype: 'div',
                id: 'mExportSTL',
                html: '导出stl文件',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportSTL');
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default AssetMenu;