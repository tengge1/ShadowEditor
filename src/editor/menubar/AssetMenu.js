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
                html: '导出Geometry',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportGeometry');
                }
            }, {
                xtype: 'div',
                id: 'mExportObject',
                html: '导出Object',
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
                xtype: 'div',
                id: 'mExportOBJ',
                html: '导出OBJ',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportOBJ');
                }
            }, {
                xtype: 'div',
                id: 'mExportSTL',
                html: '导出STL',
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