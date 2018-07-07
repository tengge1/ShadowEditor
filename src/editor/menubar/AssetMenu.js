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
                text: '导入',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mImportAsset');
                }
            }, {
                xtype: 'div',
                id: 'mExportGeometry',
                text: '导出Geometry',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportGeometry');
                }
            }, {
                xtype: 'div',
                id: 'mExportObject',
                text: '导出Object',
                cls: 'options',
                onClick: function () {
                    _this.app.call('mExportObject');
                }
            }, {
                xtype: 'div',
                id: 'mExportScene',
                text: '导出场景',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportScene');
                }
            }, {
                xtype: 'div',
                id: 'mExportOBJ',
                text: '导出OBJ',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportOBJ');
                }
            }, {
                xtype: 'div',
                id: 'mExportSTL',
                text: '导出STL',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mExportSTL');
                }
            }]
        }]
    };

    this.dom = XType.create(data);
    this.parent.appendChild(this.dom);
}

export default AssetMenu;