import UI from '../../ui/UI';

/**
 * 资源菜单
 * @param {*} options 
 */
function AssetMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

AssetMenu.prototype = Object.create(UI.Control.prototype);
AssetMenu.prototype.constructor = AssetMenu;

AssetMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
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
                id: 'mAddAsset',
                html: '添加模型',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mAddAsset');
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
    });

    container.render();
}

export default AssetMenu;