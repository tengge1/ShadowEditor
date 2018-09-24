import UI from '../../ui/UI';
import ModelWindow from '../window/ModelWindow';
import TextureWindow from '../window/TextureWindow';
import AudioWindow from '../window/AudioWindow';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
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
                html: '模型管理',
                cls: 'option',
                onClick: this.onManageModel.bind(this)
            }, {
                xtype: 'div',
                html: '纹理管理',
                cls: 'option',
                onClick: this.onManageTexture.bind(this)
            }, {
                xtype: 'div',
                html: '音频管理',
                cls: 'option',
                onClick: this.onManageAudio.bind(this)
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

// --------------------------------- 模型管理 --------------------------------------

AssetMenu.prototype.onManageModel = function () {
    if (this.modelWindow == null) {
        this.modelWindow = new ModelWindow({ parent: this.app.container, app: this.app });
        this.modelWindow.render();
    }
    this.modelWindow.show();
};

// --------------------------------- 纹理管理 --------------------------------------

AssetMenu.prototype.onManageTexture = function () {
    if (this.textureWindow == null) {
        this.textureWindow = new TextureWindow({ parent: this.app.container, app: this.app });
        this.textureWindow.render();
    }
    this.textureWindow.show();
};

// --------------------------------- 音频管理 --------------------------------------

AssetMenu.prototype.onManageAudio = function () {
    if (this.audioWindow == null) {
        this.audioWindow = new AudioWindow({ parent: this.app.container, app: this.app });
        this.audioWindow.render();
    }
    this.audioWindow.show();
};

export default AssetMenu;