import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';
import TextureEditWindow from './TextureEditWindow';

/**
 * 纹理窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextureWindow(options) {
    UI.ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = '纹理列表';
    this.width = '920px';

    this.imageIcon = 'icon-texture';
    // this.cornerTextField = 'Type';
    this.uploadUrl = `${this.app.options.server}/api/Texture/Add`;
    this.preImageUrl = this.app.options.server;
    this.showUploadButton = true;

    this.settingPanel = {
        xtype: 'div',
        style: {
            width: '220px',
            borderLeft: '1px solid #ccc',
            overflowY: 'auto'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '纹理设置'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '各向异性'
            }, {
                xtype: 'int',
                id: 'anisotropy',
                scope: this.id,
                style: {
                    width: '80px'
                },
                range: [1, 16]
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '中心点'
            }, {
                xtype: 'number',
                id: 'centerX',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }, {
                xtype: 'number',
                id: 'centerY',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '偏移'
            }, {
                xtype: 'number',
                id: 'offsetX',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }, {
                xtype: 'number',
                id: 'offsetY',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '重复'
            }, {
                xtype: 'int',
                id: 'repeatX',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }, {
                xtype: 'int',
                id: 'repearY',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '旋转'
            }, {
                xtype: 'number',
                id: 'rotation',
                scope: this.id,
                style: {
                    width: '40px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                    [THREE.UnsignedByteType]: 'UnsignedByteType',
                    [THREE.ByteType]: 'ByteType',
                    [THREE.ShortType]: 'ShortType',
                    [THREE.UnsignedShortType]: 'UnsignedShortType',
                    [THREE.IntType]: 'IntType',
                    [THREE.UnsignedIntType]: 'UnsignedIntType',
                    [THREE.FloatType]: 'FloatType',
                    [THREE.HalfFloatType]: 'HalfFloatType',
                    [THREE.UnsignedShort4444Type]: 'UnsignedShort4444Type',
                    [THREE.UnsignedShort5551Type]: 'UnsignedShort5551Type',
                    [THREE.UnsignedShort565Type]: 'UnsignedShort565Type',
                    [THREE.UnsignedInt248Type]: 'UnsignedInt248Type'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '编码'
            }, {
                xtype: 'select',
                id: 'encoding',
                scope: this.id,
                options: {
                    [THREE.LinearEncoding]: 'LinearEncoding',
                    [THREE.sRGBEncoding]: 'sRGBEncoding',
                    [THREE.GammaEncoding]: 'GammaEncoding',
                    [THREE.RGBEEncoding]: 'RGBEEncoding',
                    [THREE.LogLuvEncoding]: 'LogLuvEncoding',
                    [THREE.RGBM7Encoding]: 'RGBM7Encoding',
                    [THREE.RGBM16Encoding]: 'RGBM16Encoding',
                    [THREE.RGBDEncoding]: 'RGBDEncoding',
                    [THREE.BasicDepthPacking]: 'BasicDepthPacking',
                    [THREE.RGBADepthPacking]: 'RGBADepthPacking'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '反转Y'
            }, {
                xtype: 'checkbox',
                id: 'flipY',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '格式'
            }, {
                xtype: 'select',
                id: 'format',
                scope: this.id,
                options: {
                    [THREE.RGBAFormat]: 'RGBAFormat',
                    [THREE.AlphaFormat]: 'AlphaFormat',
                    [THREE.RGBFormat]: 'RGBFormat',
                    [THREE.LuminanceFormat]: 'LuminanceFormat',
                    [THREE.LuminanceAlphaFormat]: 'LuminanceAlphaFormat',
                    [THREE.RGBEFormat]: 'RGBEFormat',
                    [THREE.DepthFormat]: 'DepthFormat',
                    [THREE.DepthStencilFormat]: 'DepthStencilFormat'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开启层级'
            }, {
                xtype: 'checkbox',
                id: 'generateMipmaps',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '放大过滤'
            }, {
                xtype: 'select',
                id: 'magFilter',
                scope: this.id,
                options: {
                    [THREE.LinearFilter]: 'LinearFilter',
                    [THREE.NearestFilter]: 'NearestFilter'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '缩小过滤'
            }, {
                xtype: 'select',
                id: 'minFilter',
                scope: this.id,
                options: {
                    [THREE.LinearMipMapLinearFilter]: 'LinearMipMapLinearFilter',
                    [THREE.NearestFilter]: 'NearestFilter',
                    [THREE.NearestMipMapNearestFilter]: 'NearestMipMapNearestFilter',
                    [THREE.NearestMipMapLinearFilter]: 'NearestMipMapLinearFilter',
                    [THREE.LinearFilter]: 'LinearFilter',
                    [THREE.LinearMipMapNearestFilter]: 'LinearMipMapNearestFilter'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '映射'
            }, {
                xtype: 'select',
                id: 'mapping',
                scope: this.id,
                options: {
                    [THREE.UVMapping]: 'UVMapping',
                    [THREE.CubeReflectionMapping]: 'CubeReflectionMapping',
                    [THREE.CubeRefractionMapping]: 'CubeRefractionMapping',
                    [THREE.EquirectangularReflectionMapping]: 'EquirectangularReflectionMapping',
                    [THREE.EquirectangularRefractionMapping]: 'EquirectangularRefractionMapping',
                    [THREE.SphericalReflectionMapping]: 'SphericalReflectionMapping',
                    [THREE.CubeUVReflectionMapping]: 'CubeUVReflectionMapping',
                    [THREE.CubeUVRefractionMapping]: 'CubeUVRefractionMapping'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '左乘透明'
            }, {
                xtype: 'checkbox',
                id: 'premultiplyAlpha',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '解压对齐'
            }, {
                xtype: 'select',
                id: 'unpackAlignment',
                scope: this.id,
                options: {
                    [4]: '4',
                    [1]: '1',
                    [2]: '2',
                    [8]: '8'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '横向包装'
            }, {
                xtype: 'select',
                id: 'wrapS',
                scope: this.id,
                options: {
                    [THREE.ClampToEdgeWrapping]: 'ClampToEdgeWrapping',
                    [THREE.RepeatWrapping]: 'RepeatWrapping',
                    [THREE.MirroredRepeatWrapping]: 'MirroredRepeatWrapping'
                },
                style: {
                    width: '120px'
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '纵向包装'
            }, {
                xtype: 'select',
                id: 'wrapT',
                scope: this.id,
                options: {
                    [THREE.ClampToEdgeWrapping]: 'ClampToEdgeWrapping',
                    [THREE.RepeatWrapping]: 'RepeatWrapping',
                    [THREE.MirroredRepeatWrapping]: 'MirroredRepeatWrapping'
                },
                style: {
                    width: '120px'
                }
            }]
        }]
    };

    this.onSelect = options.onSelect || null;
}

TextureWindow.prototype = Object.create(UI.ImageListWindow.prototype);
TextureWindow.prototype.constructor = TextureWindow;

TextureWindow.prototype.beforeUpdateList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/Texture/List`, obj => {
            resolve(obj.Data);
        });
    });
};

TextureWindow.prototype.onUpload = function (obj) {
    this.update();
    UI.msg(obj.Msg);
};

TextureWindow.prototype.onClick = function (data) {
    if (typeof (this.onSelect) === 'function') {
        this.onSelect(data);
    } else {
        UI.msg('请在材质控件中修改纹理。');
    }
};

TextureWindow.prototype.onEdit = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new TextureEditWindow({
            app: this.app,
            parent: this.parent,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

TextureWindow.prototype.onDelete = function (data) {
    var server = this.app.options.server;

    UI.confirm('询问', `是否删除纹理${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Texture/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default TextureWindow;