import UI from '../../../ui/UI';
import SetMaterialValueCommand from '../../../command/SetMaterialValueCommand';

/**
 * 材质面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function MaterialPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

MaterialPanel.prototype = Object.create(UI.Control.prototype);
MaterialPanel.prototype.constructor = MaterialPanel;

MaterialPanel.prototype.render = function () {
    var _this = this;
    var editor = this.app.editor;

    var update = function () {
        _this.app.call('updateMaterial', _this);
    };

    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'materialPanel',
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{ // New Copy Paste
            xtype: 'row',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    style: {
                        color: '#555',
                        fontWeight: 'bold'
                    },
                    text: '材质属性'
                }]
            }, {
                xtype: 'button',
                id: 'btnNewMaterial',
                text: '新建',
                onClick: function () {
                    this.app.call('newMaterial', this);
                }
            }, {
                xtype: 'button',
                id: 'btnCopyMaterial',
                text: '复制',
                style: {
                    marginLeft: '4px'
                },
                onClick: function () {
                    this.app.call('copyMaterial', this);
                }
            }, {
                xtype: 'button',
                text: '粘贴',
                id: 'btnPasteMaterial',
                style: {
                    marginLeft: '4px'
                },
                onClick: function () {
                    this.app.call('pasteMaterial', this);
                }
            }]
        }, { // type
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'select',
                id: 'materialClass',
                options: {
                    'LineBasicMaterial': '线条材质',
                    'LineDashedMaterial': '虚线材质',
                    'MeshBasicMaterial': '基本材质',
                    'MeshDepthMaterial': '深度材质',
                    'MeshNormalMaterial': '法向量材质',
                    'MeshLambertMaterial': '兰伯特材质',
                    'MeshPhongMaterial': '冯氏材质',
                    'PointCloudMaterial': '点云材质',
                    'MeshStandardMaterial': '标准材质',
                    'MeshPhysicalMaterial': '物理材质',
                    'ShaderMaterial': '着色器材质',
                    'SpriteMaterial': '精灵材质',
                    'RawShaderMaterial': '原始着色器材质'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: function () {
                    _this.app.call('updateMaterial');
                }
            }]
        }, { // name
            xtype: 'row',
            id: 'materialNameRow',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'materialName',
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: function () {
                    editor.execute(new SetMaterialValueCommand(editor.selected, 'name', this.getValue()));
                }
            }]
        }, { // program
            xtype: 'row',
            id: 'materialProgramRow',
            children: [{
                xtype: 'label',
                text: '着色器程序'
            }, {
                xtype: 'button',
                text: '信息',
                style: {
                    marginLeft: '4px'
                },
                onClick: function () {
                    _this.app.call('editScript', _this, currentObject, 'programInfo');
                }
            }, {
                xtype: 'button',
                text: '顶点着色器',
                style: {
                    marginLeft: '4px'
                },
                onClick: function () {
                    _this.app.call('editScript', _this, currentObject, 'vertexShader');
                }
            }, {
                xtype: 'button',
                text: '片源着色器',
                style: {
                    marginLeft: '4px'
                },
                onClick: function () {
                    _this.app.call('editScript', _this, currentObject, 'fragmentShader');
                }
            }]
        }, { // color
            xtype: 'row',
            id: 'materialColorRow',
            children: [{
                xtype: 'label',
                text: '颜色'
            }, {
                xtype: 'color',
                id: 'materialColor',
                onChange: update
            }]
        }, { // roughness
            xtype: 'row',
            id: 'materialRoughnessRow',
            children: [{
                xtype: 'label',
                text: '粗糙度'
            }, {
                xtype: 'number',
                id: 'materialRoughness',
                value: 0.5,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: update
            }]
        }, { // metalness
            xtype: 'row',
            id: 'materialMetalnessRow',
            children: [{
                xtype: 'label',
                text: '金属度'
            }, {
                xtype: 'number',
                id: 'materialMetalness',
                value: 0.5,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: update
            }]
        }, { // emissive
            xtype: 'row',
            id: 'materialEmissiveRow',
            children: [{
                xtype: 'label',
                text: '发光'
            }, {
                xtype: 'color',
                id: 'materialEmissive',
                value: 0x000000,
                onChange: update
            }]
        }, { // specular
            xtype: 'row',
            id: 'materialSpecularRow',
            children: [{
                xtype: 'label',
                text: '镜面度'
            }, {
                xtype: 'color',
                id: 'materialSpecular',
                value: 0x111111,
                onChange: update
            }]
        }, { // shininess
            xtype: 'row',
            id: 'materialShininessRow',
            children: [{
                xtype: 'label',
                text: '光亮度'
            }, {
                xtype: 'number',
                id: 'materialShininess',
                value: 30,
                onChange: update
            }]
        }, { // clearCoat
            xtype: 'row',
            id: 'materialClearCoatRow',
            children: [{
                xtype: 'label',
                text: '透明度'
            }, {
                xtype: 'number',
                id: 'materialClearCoat',
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: update
            }]
        }, { // clearCoatRoughness
            xtype: 'row',
            id: 'materialClearCoatRoughnessRow',
            children: [{
                xtype: 'label',
                text: '透明粗糙度'
            }, {
                xtype: 'number',
                id: 'materialClearCoatRoughness',
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: update
            }]
        }, { // vertex colors
            xtype: 'row',
            id: 'materialVertexColorsRow',
            children: [{
                xtype: 'label',
                text: '顶点颜色'
            }, {
                xtype: 'select',
                id: 'materialVertexColors',
                options: {
                    0: '无',
                    1: '面',
                    2: '顶点'
                },
                onChange: update
            }]
        }, { // skinning
            xtype: 'row',
            id: 'materialSkinningRow',
            children: [{
                xtype: 'label',
                text: '皮肤'
            }, {
                xtype: 'checkbox',
                id: 'materialSkinning',
                value: false,
                onChange: update
            }]
        }, { // map
            xtype: 'row',
            id: 'materialMapRow',
            children: [{
                xtype: 'label',
                text: '纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialMap',
                onChange: update
            }]
        }, { // alpha map
            xtype: 'row',
            id: 'materialAlphaMapRow',
            children: [{
                xtype: 'label',
                text: '透明纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialAlphaMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialAlphaMap',
                onChange: update
            }]
        }, { // bump map
            xtype: 'row',
            id: 'materialBumpMapRow',
            children: [{
                xtype: 'label',
                text: '凹凸纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialBumpMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialBumpMap',
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: update
            }, {
                xtype: 'number',
                id: 'materialBumpScale',
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: update
            }]
        }, { // normal map
            xtype: 'row',
            id: 'materialNormalMapRow',
            children: [{
                xtype: 'label',
                text: '法线纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialNormalMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialNormalMap',
                onChange: update
            }]
        }, { // displacement map
            xtype: 'row',
            id: 'materialDisplacementMapRow',
            children: [{
                xtype: 'label',
                text: '位移纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialDisplacementMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialDisplacementMap',
                onChange: update
            }, {
                xtype: 'number',
                id: 'materialDisplacementScale',
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: update
            }]
        }, { // roughness map
            xtype: 'row',
            id: 'materialRoughnessMapRow',
            children: [{
                xtype: 'label',
                text: '粗糙纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialRoughnessMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialRoughnessMap',
                onChange: update
            }]
        }, { // metalness map
            xtype: 'row',
            id: 'materialMetalnessMapRow',
            children: [{
                xtype: 'label',
                text: '金属纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialMetalnessMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialMetalnessMap',
                onChange: update
            }]
        }, { // specular map
            xtype: 'row',
            id: 'materialSpecularMapRow',
            children: [{
                xtype: 'label',
                text: '镜面纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialSpecularMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialSpecularMap',
                onChange: update
            }]
        }, { // env map
            xtype: 'row',
            id: 'materialEnvMapRow',
            children: [{
                xtype: 'label',
                text: '环境纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialEnvMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialEnvMap',
                mapping: THREE.SphericalReflectionMapping,
                onChange: update
            }, {
                xtype: 'number',
                id: 'materialReflectivity',
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: update
            }]
        }, { // light map
            xtype: 'row',
            id: 'materialLightMapRow',
            children: [{
                xtype: 'label',
                text: '光照纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialLightMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialLightMap',
                onChange: update
            }]
        }, { // ambient occlusion map
            xtype: 'row',
            id: 'materialAOMapRow',
            children: [{
                xtype: 'label',
                text: '遮挡纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialAOMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialAOMap',
                onChange: update
            }, {
                xtype: 'number',
                id: 'materialAOScale',
                value: 1,
                range: [0, 1],
                style: {
                    width: '30px'
                },
                onChange: update
            }]
        }, { // emissive map
            xtype: 'row',
            id: 'materialEmissiveMapRow',
            children: [{
                xtype: 'label',
                text: '放射纹理'
            }, {
                xtype: 'checkbox',
                id: 'materialEmissiveMapEnabled',
                value: false,
                onChange: update
            }, {
                xtype: 'texture',
                id: 'materialEmissiveMap',
                onChange: update
            }]
        }, { // side
            xtype: 'row',
            id: 'materialSideRow',
            children: [{
                xtype: 'label',
                text: '剔除'
            }, {
                xtype: 'select',
                id: 'materialSide',
                options: {
                    0: '正面',
                    1: '反面',
                    2: '双面'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: update
            }]
        }, { // shading
            xtype: 'row',
            id: 'materialShadingRow',
            children: [{
                xtype: 'label',
                text: '着色'
            }, {
                xtype: 'select',
                id: 'materialShading',
                options: {
                    0: '无',
                    1: '平坦',
                    2: '光滑'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: update
            }]
        }, { // blending
            xtype: 'row',
            id: 'materialBlendingRow',
            children: [{
                xtype: 'label',
                text: '混合'
            }, {
                xtype: 'select',
                id: 'materialBlending',
                options: {
                    0: '不混合',
                    1: '一般混合',
                    2: '和混合',
                    3: '差混合',
                    4: '积混合',
                    5: '自定义混合'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: update
            }]
        }, { // opacity
            xtype: 'row',
            id: 'materialOpacityRow',
            children: [{
                xtype: 'label',
                text: '不透明度'
            }, {
                xtype: 'number',
                id: 'materialOpacity',
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: update
            }]
        }, { // transparent
            xtype: 'row',
            id: 'materialTransparentRow',
            children: [{
                xtype: 'label',
                text: '透明'
            }, {
                xtype: 'checkbox',
                id: 'materialTransparent',
                style: {
                    left: '100px'
                },
                onChange: update
            }]
        }, { // alpha test
            xtype: 'row',
            id: 'materialAlphaTestRow',
            children: [{
                xtype: 'label',
                text: 'α测试'
            }, {
                xtype: 'number',
                id: 'materialAlphaTest',
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: update
            }]
        }, { // wireframe
            xtype: 'row',
            id: 'materialWireframeRow',
            children: [{
                xtype: 'label',
                text: '线框'
            }, {
                xtype: 'checkbox',
                id: 'materialWireframe',
                value: false,
                onChange: update
            }, {
                xtype: 'number',
                id: 'materialWireframeLinewidth',
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 100],
                onChange: update
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default MaterialPanel;