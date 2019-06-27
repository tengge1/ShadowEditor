import UI from '../../ui/UI';

/**
 * 纹理设置窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextureSettingWindow(options) {
    UI.Control.call(this, options);
    app = options.app;
}

TextureSettingWindow.prototype = Object.create(UI.Control.prototype);
TextureSettingWindow.prototype.constructor = TextureSettingWindow;

TextureSettingWindow.prototype.render = function () {
    this.window = UI.create({
        xtype: 'window',
        title: L_TEXTURE_SETTINGS,
        width: '300px',
        height: '450px',
        bodyStyle: {
            padding: 0
        },
        shade: false,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_OFFSET
            }, {
                xtype: 'number',
                id: 'offsetX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'offsetY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ROTATE_CENTER
            }, {
                xtype: 'number',
                id: 'centerX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'centerY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ROTATE
            }, {
                xtype: 'number',
                id: 'rotation',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_WRAP_S
            }, {
                xtype: 'select',
                id: 'wrapS',
                scope: this.id,
                options: {
                    [THREE.ClampToEdgeWrapping]: L_CLAMP_TO_EDGE,
                    [THREE.RepeatWrapping]: L_REPEAT,
                    [THREE.MirroredRepeatWrapping]: L_MIRRORED_REPEAT
                },
                style: {
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_WRAP_T
            }, {
                xtype: 'select',
                id: 'wrapT',
                scope: this.id,
                options: {
                    [THREE.ClampToEdgeWrapping]: L_CLAMP_TO_EDGE,
                    [THREE.RepeatWrapping]: L_REPEAT,
                    [THREE.MirroredRepeatWrapping]: L_MIRRORED_REPEAT
                },
                style: {
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_REPEAT_NUM
            }, {
                xtype: 'int',
                id: 'repeatX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'int',
                id: 'repeatY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_FLIP_Y
            }, {
                xtype: 'checkbox',
                id: 'flipY',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAG_FILTER
            }, {
                xtype: 'select',
                id: 'magFilter',
                scope: this.id,
                options: {
                    [THREE.LinearFilter]: 'LinearFilter',
                    [THREE.NearestFilter]: 'NearestFilter'
                },
                style: {
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIN_FILTER
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
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TYPE
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
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENCODING
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
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_FORMAT
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
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_GENERATE_MIPMAPS
            }, {
                xtype: 'checkbox',
                id: 'generateMipmaps',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAPPING
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
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_PREMULTIPLY_ALPHA
            }, {
                xtype: 'checkbox',
                id: 'premultiplyAlpha',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_UNPACK_ALIGNMENT
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
                    width: '160px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ANISOTROPY
            }, {
                xtype: 'int',
                id: 'anisotropy',
                scope: this.id,
                style: {
                    width: '80px'
                },
                range: [1, 16],
                onChange: this.onChange.bind(this)
            }]
        }]
    });
    this.window.render();
};

TextureSettingWindow.prototype.show = function () {
    this.window.show();
};

TextureSettingWindow.prototype.hide = function () {
    this.window.hide();
};

TextureSettingWindow.prototype.setData = function (texture) {
    var anisotropy = UI.get('anisotropy', this.id);
    var centerX = UI.get('centerX', this.id);
    var centerY = UI.get('centerY', this.id);
    var offsetX = UI.get('offsetX', this.id);
    var offsetY = UI.get('offsetY', this.id);
    var repeatX = UI.get('repeatX', this.id);
    var repeatY = UI.get('repeatY', this.id);
    var rotation = UI.get('rotation', this.id);
    var type = UI.get('type', this.id);
    var encoding = UI.get('encoding', this.id);
    var flipY = UI.get('flipY', this.id);
    var format = UI.get('format', this.id);
    var generateMipmaps = UI.get('generateMipmaps', this.id);
    var magFilter = UI.get('magFilter', this.id);
    var minFilter = UI.get('minFilter', this.id);
    var mapping = UI.get('mapping', this.id);
    var premultiplyAlpha = UI.get('premultiplyAlpha', this.id);
    var unpackAlignment = UI.get('unpackAlignment', this.id);
    var wrapS = UI.get('wrapS', this.id);
    var wrapT = UI.get('wrapT', this.id);

    this.texture = texture;

    anisotropy.setValue(texture.anisotropy);
    centerX.setValue(texture.center.x);
    centerY.setValue(texture.center.y);
    offsetX.setValue(texture.offset.x);
    offsetY.setValue(texture.offset.y);
    repeatX.setValue(texture.repeat.x);
    repeatY.setValue(texture.repeat.y);
    rotation.setValue(texture.rotation);
    type.setValue(texture.type);
    encoding.setValue(texture.encoding);
    flipY.setValue(texture.flipY);
    format.setValue(texture.format);
    generateMipmaps.setValue(texture.generateMipmaps);
    magFilter.setValue(texture.magFilter);
    minFilter.setValue(texture.minFilter);
    mapping.setValue(texture.mapping);
    premultiplyAlpha.setValue(texture.premultiplyAlpha);
    unpackAlignment.setValue(texture.unpackAlignment);
    wrapS.setValue(texture.wrapS);
    wrapT.setValue(texture.wrapT);
};

TextureSettingWindow.prototype.onChange = function () {
    var anisotropy = UI.get('anisotropy', this.id);
    var centerX = UI.get('centerX', this.id);
    var centerY = UI.get('centerY', this.id);
    var offsetX = UI.get('offsetX', this.id);
    var offsetY = UI.get('offsetY', this.id);
    var repeatX = UI.get('repeatX', this.id);
    var repeatY = UI.get('repeatY', this.id);
    var rotation = UI.get('rotation', this.id);
    var type = UI.get('type', this.id);
    var encoding = UI.get('encoding', this.id);
    var flipY = UI.get('flipY', this.id);
    var format = UI.get('format', this.id);
    var generateMipmaps = UI.get('generateMipmaps', this.id);
    var magFilter = UI.get('magFilter', this.id);
    var minFilter = UI.get('minFilter', this.id);
    var mapping = UI.get('mapping', this.id);
    var premultiplyAlpha = UI.get('premultiplyAlpha', this.id);
    var unpackAlignment = UI.get('unpackAlignment', this.id);
    var wrapS = UI.get('wrapS', this.id);
    var wrapT = UI.get('wrapT', this.id);

    var texture = this.texture;

    texture.anisotropy = anisotropy.getValue();
    texture.center.x = centerX.getValue();
    texture.center.y = centerY.getValue();
    texture.offset.x = offsetX.getValue();
    texture.offset.y = offsetY.getValue();
    texture.repeat.x = repeatX.getValue();
    texture.repeat.y = repeatY.getValue();
    texture.rotation = rotation.getValue();
    texture.type = parseInt(type.getValue());
    texture.encoding = parseInt(encoding.getValue());
    texture.flipY = flipY.getValue();
    texture.format = parseInt(format.getValue());
    texture.generateMipmaps = generateMipmaps.getValue();
    texture.magFilter = parseInt(magFilter.getValue());
    texture.minFilter = parseInt(minFilter.getValue());
    texture.mapping = parseInt(mapping.getValue());
    texture.premultiplyAlpha = premultiplyAlpha.getValue();
    texture.unpackAlignment = parseInt(unpackAlignment.getValue());
    texture.wrapS = parseInt(wrapS.getValue());
    texture.wrapT = parseInt(wrapT.getValue());

    texture.needsUpdate = true;
};

export default TextureSettingWindow;