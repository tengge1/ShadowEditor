import BaseComponent from './BaseComponent';
import SetMaterialValueCommand from '../command/SetMaterialValueCommand';

/**
 * 材质组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MaterialComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

MaterialComponent.prototype = Object.create(BaseComponent.prototype);
MaterialComponent.prototype.constructor = MaterialComponent;

MaterialComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'materialPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '材质组件'
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
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'programRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '着色程序'
            }, {
                xtype: 'button',
                id: 'btnProgramInfo',
                scope: this.id,
                text: '信息',
                style: {
                    marginLeft: '4px'
                },
                onClick: () => {

                }
            }, {
                xtype: 'button',
                id: 'btnVertexSHader',
                scope: this.id,
                text: '顶点',
                style: {
                    marginLeft: '4px'
                },
                onClick: () => {

                }
            }, {
                xtype: 'button',
                id: 'btnFragmentShader',
                scope: this.id,
                text: '片源',
                style: {
                    marginLeft: '4px'
                },
                onClick: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'colorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '颜色'
            }, {
                xtype: 'color',
                id: 'color',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'roughnessRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '粗糙度'
            }, {
                xtype: 'number',
                id: 'roughness',
                scope: this.id,
                value: 0.5,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'metalnessRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '金属度'
            }, {
                xtype: 'number',
                id: 'metalness',
                scope: this.id,
                value: 0.5,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'emissiveRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '发光'
            }, {
                xtype: 'color',
                id: 'emissive',
                scope: this.id,
                value: 0x000000,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'specularRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '镜面度'
            }, {
                xtype: 'color',
                id: 'specular',
                scope: this.id,
                value: 0x111111,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'shininessRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '光亮度'
            }, {
                xtype: 'number',
                id: 'shininess',
                scope: this.id,
                value: 30,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'clearCoatRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '透明度'
            }, {
                xtype: 'number',
                id: 'clearCoat',
                scope: this.id,
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'clearCoatRoughnessRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '透明粗糙度'
            }, {
                xtype: 'number',
                id: 'clearCoatRoughness',
                scope: this.id,
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'vertexColorsRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '顶点颜色'
            }, {
                xtype: 'select',
                id: 'vertexColors',
                scope: this.id,
                options: {
                    0: '无',
                    1: '面',
                    2: '顶点'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'skinningRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '皮肤'
            }, {
                xtype: 'checkbox',
                id: 'skinning',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'mapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '纹理'
            }, {
                xtype: 'checkbox',
                id: 'mapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'map',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'alphaMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '透明纹理'
            }, {
                xtype: 'checkbox',
                id: 'alphaMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'alphaMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'bumpMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '凹凸纹理'
            }, {
                xtype: 'checkbox',
                id: 'bumpMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'bumpMap',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: () => {

                }
            }, {
                xtype: 'number',
                id: 'bumpScale',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'normalMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '法线纹理'
            }, {
                xtype: 'checkbox',
                id: 'normalMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'normalMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'displacementMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '位移纹理'
            }, {
                xtype: 'checkbox',
                id: 'displacementMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'displacementMap',
                scope: this.id,
                onChange: () => {

                }
            }, {
                xtype: 'number',
                id: 'displacementScale',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'roughnessMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '粗糙纹理'
            }, {
                xtype: 'checkbox',
                id: 'roughnessMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'roughnessMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'metalnessMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '金属纹理'
            }, {
                xtype: 'checkbox',
                id: 'metalnessMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'metalnessMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'specularMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '镜面纹理'
            }, {
                xtype: 'checkbox',
                id: 'specularMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'specularMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'envMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '环境纹理'
            }, {
                xtype: 'checkbox',
                id: 'envMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'envMap',
                scope: this.id,
                mapping: THREE.SphericalReflectionMapping,
                onChange: () => {

                }
            }, {
                xtype: 'number',
                id: 'reflectivity',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'lightMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '光照纹理'
            }, {
                xtype: 'checkbox',
                id: 'lightMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'lightMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'aoMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '遮挡纹理'
            }, {
                xtype: 'checkbox',
                id: 'aoMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'aoMap',
                scope: this.id,
                onChange: () => {

                }
            }, {
                xtype: 'number',
                id: 'aoScale',
                scope: this.id,
                value: 1,
                range: [0, 1],
                style: {
                    width: '30px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'emissiveMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '放射纹理'
            }, {
                xtype: 'checkbox',
                id: 'emissiveMapEnabled',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'texture',
                id: 'emissiveMap',
                scope: this.id,
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'sideRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '剔除'
            }, {
                xtype: 'select',
                id: 'side',
                scope: this.id,
                options: {
                    0: '正面',
                    1: '反面',
                    2: '双面'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'shadingRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '着色'
            }, {
                xtype: 'select',
                id: 'shading',
                scope: this.id,
                options: {
                    0: '无',
                    1: '平坦',
                    2: '光滑'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'blendingRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '混合'
            }, {
                xtype: 'select',
                id: 'blending',
                scope: this.id,
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
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'opacityRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '不透明度'
            }, {
                xtype: 'number',
                id: 'opacity',
                scope: this.id,
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'transparentRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '透明'
            }, {
                xtype: 'checkbox',
                id: 'transparent',
                scope: this.id,
                style: {
                    left: '100px'
                },
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'alphaTestRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: 'α测试'
            }, {
                xtype: 'number',
                id: 'alphaTest',
                scope: this.id,
                style: {
                    width: '60px'
                },
                range: [0, 1],
                onChange: () => {

                }
            }]
        }, {
            xtype: 'row',
            id: 'wireframeRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '线框'
            }, {
                xtype: 'checkbox',
                id: 'wireframe',
                scope: this.id,
                value: false,
                onChange: () => {

                }
            }, {
                xtype: 'number',
                id: 'wireframeLinewidth',
                scope: this.id,
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 100],
                onChange: () => {

                }
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

MaterialComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

MaterialComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

MaterialComponent.prototype.updateUI = function () {
    var container = UI.get('materialPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && !Array.isArray(editor.selected.material)) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var material = this.selected.material;

    // 根据选中物体为控件赋值
    var programRow = UI.get('programRow', this.id);

    var type = UI.get('type', this.id);
    var color = UI.get('color', this.id);
    var roughness = UI.get('roughness', this.id);
    var metalness = UI.get('metalness', this.id);
    var emissive = UI.get('emissive', this.id);
    var specular = UI.get('specular', this.id);
    var shininess = UI.get('shininess', this.id);

    type.setValue(material.constructor.name);

    if (material instanceof THREE.ShaderMaterial || material instanceof THREE.RawShaderMaterial) {
        programRow.dom.style.display = '';
    } else {
        programRow.dom.style.display = 'none';
    }

    color.setValue(`#${material.color.getHexString()}`);
    roughness.setValue(material.roughness);
    metalness.setValue(material.metalness);
    emissive.setValue(`#${material.emissive.getHexString()}`);
    specular.setValue(`#${material.specular === undefined ? '111111' : material.specular.getHexString()}`);
    shininess.setValue(material.shininess);
};

export default MaterialComponent;