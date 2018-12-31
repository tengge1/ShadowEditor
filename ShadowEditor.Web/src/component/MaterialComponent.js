import BaseComponent from './BaseComponent';
import SetMaterialCommand from '../command/SetMaterialCommand';
import SetMaterialColorCommand from '../command/SetMaterialColorCommand';
import SetMaterialValueCommand from '../command/SetMaterialValueCommand';
import SetMaterialMapCommand from '../command/SetMaterialMapCommand';
import ShaderMaterialVertex from './shader/shader_material_vertex.glsl';
import ShaderMaterialFragment from './shader/shader_material_fragment.glsl';
import RawShaderMaterialVertex from './shader/raw_shader_material_vertex.glsl';
import RawShaderMaterialFragment from './shader/raw_shader_material_fragment.glsl';

import TextureSelectControl from '../editor/control/TextureSelectControl';
import TextureSettingWindow from '../editor/window/TextureSettingWindow';

import MaterialsSerializer from '../serialization/material/MaterialsSerializer';
import MaterialUtils from '../utils/MaterialUtils';

import Ajax from '../utils/Ajax';
import Converter from '../utils/Converter';

/**
 * 材质组件
 * @author mrdoob / http://mrdoob.com/
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
                text: ''
            }, {
                xtype: 'button',
                text: '保存',
                onClick: this.onSave.bind(this)
            }, {
                xtype: 'button',
                text: '选择',
                onClick: this.onLoad.bind(this)
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
                    'SpriteMaterial': '精灵材质',
                    'ShaderMaterial': '着色器材质',
                    'RawShaderMaterial': '原始着色器材质'
                },
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: this.updateMaterial.bind(this)
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
                scope: this.id,
                text: '信息',
                style: {
                    marginLeft: '4px'
                },
                onClick: this.editProgramInfo.bind(this)
            }, {
                xtype: 'button',
                scope: this.id,
                text: '顶点',
                style: {
                    marginLeft: '4px'
                },
                onClick: this.editVertexShader.bind(this)
            }, {
                xtype: 'button',
                scope: this.id,
                text: '片源',
                style: {
                    marginLeft: '4px'
                },
                onClick: this.editFragmentShader.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
            },
            new TextureSelectControl({
                app: this.app,
                id: 'map',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            }), {
                xtype: 'linkbutton',
                text: '设置',
                style: {
                    marginLeft: '4px'
                },
                onClick: this.onSetMap.bind(this)
            }
            ]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'alphaMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'bumpMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            }), {
                xtype: 'number',
                id: 'bumpScale',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'normalMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'displacementMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            }), {
                xtype: 'number',
                id: 'displacementScale',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'roughnessMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'metalnessMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'specularMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'envMap',
                scope: this.id,
                mapping: THREE.SphericalReflectionMapping,
                onChange: this.updateMaterial.bind(this)
            }), {
                xtype: 'number',
                id: 'reflectivity',
                scope: this.id,
                value: 1,
                style: {
                    width: '30px'
                },
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'lightMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'aoMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            }), {
                xtype: 'number',
                id: 'aoScale',
                scope: this.id,
                value: 1,
                range: [0, 1],
                style: {
                    width: '30px'
                },
                onChange: this.updateMaterial.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'emissiveMapRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '发光纹理'
            }, {
                xtype: 'checkbox',
                id: 'emissiveMapEnabled',
                scope: this.id,
                value: false,
                onChange: this.updateMaterial.bind(this)
            }, new TextureSelectControl({
                app: this.app,
                id: 'emissiveMap',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
            })]
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
                onChange: this.updateMaterial.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'flatShadingRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '平滑'
            }, {
                xtype: 'checkbox',
                id: 'flatShading',
                scope: this.id,
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
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
                onChange: this.updateMaterial.bind(this)
            }, {
                xtype: 'number',
                id: 'wireframeLinewidth',
                scope: this.id,
                value: 1,
                style: {
                    width: '60px'
                },
                range: [0, 100],
                onChange: this.updateMaterial.bind(this)
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
    if (editor.selected && (editor.selected instanceof THREE.Mesh || editor.selected instanceof THREE.Sprite) && !Array.isArray(editor.selected.material)) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    this.setRowVisibility();
    this.setRowValue();
};

MaterialComponent.prototype.setRowVisibility = function () {
    var programRow = UI.get('programRow', this.id);
    var colorRow = UI.get('colorRow', this.id);
    var roughnessRow = UI.get('roughnessRow', this.id);
    var metalnessRow = UI.get('metalnessRow', this.id);
    var emissiveRow = UI.get('emissiveRow', this.id);
    var specularRow = UI.get('specularRow', this.id);
    var shininessRow = UI.get('shininessRow', this.id);
    var clearCoatRow = UI.get('clearCoatRow', this.id);
    var clearCoatRoughnessRow = UI.get('clearCoatRoughnessRow', this.id);
    var vertexColorsRow = UI.get('vertexColorsRow', this.id);
    var skinningRow = UI.get('skinningRow', this.id);
    var mapRow = UI.get('mapRow', this.id);
    var alphaMapRow = UI.get('alphaMapRow', this.id);
    var bumpMapRow = UI.get('bumpMapRow', this.id);
    var normalMapRow = UI.get('normalMapRow', this.id);
    var displacementMapRow = UI.get('displacementMapRow', this.id);
    var roughnessMapRow = UI.get('roughnessMapRow', this.id);
    var metalnessMapRow = UI.get('metalnessMapRow', this.id);
    var specularMapRow = UI.get('specularMapRow', this.id);
    var envMapRow = UI.get('envMapRow', this.id);
    var lightMapRow = UI.get('lightMapRow', this.id);
    var aoMapRow = UI.get('aoMapRow', this.id);
    var emissiveMapRow = UI.get('emissiveMapRow', this.id);
    var sideRow = UI.get('sideRow', this.id);
    var flatShadingRow = UI.get('flatShadingRow', this.id);
    var blendingRow = UI.get('blendingRow', this.id);
    var opacityRow = UI.get('opacityRow', this.id);
    var transparentRow = UI.get('transparentRow', this.id);
    var alphaTestRow = UI.get('alphaTestRow', this.id);
    var wireframeRow = UI.get('wireframeRow', this.id);

    var properties = {
        'vertexShader': programRow,
        'color': colorRow,
        'roughness': roughnessRow,
        'metalness': metalnessRow,
        'emissive': emissiveRow,
        'specular': specularRow,
        'shininess': shininessRow,
        'clearCoat': clearCoatRow,
        'clearCoatRoughness': clearCoatRoughnessRow,
        'vertexColors': vertexColorsRow,
        'skinning': skinningRow,
        'map': mapRow,
        'alphaMap': alphaMapRow,
        'bumpMap': bumpMapRow,
        'normalMap': normalMapRow,
        'displacementMap': displacementMapRow,
        'roughnessMap': roughnessMapRow,
        'metalnessMap': metalnessMapRow,
        'specularMap': specularMapRow,
        'envMap': envMapRow,
        'lightMap': lightMapRow,
        'aoMap': aoMapRow,
        'emissiveMap': emissiveMapRow,
        'side': sideRow,
        'flatShading': flatShadingRow,
        'blending': blendingRow,
        'opacity': opacityRow,
        'transparent': transparentRow,
        'alphaTest': alphaTestRow,
        'wireframe': wireframeRow
    };

    var material = this.selected.material;
    for (var property in properties) {
        properties[property].dom.style.display = material[property] === undefined ? 'none' : ''
    }
};

MaterialComponent.prototype.setRowValue = function () {
    var type = UI.get('type', this.id);
    var color = UI.get('color', this.id);
    var roughness = UI.get('roughness', this.id);
    var metalness = UI.get('metalness', this.id);
    var emissive = UI.get('emissive', this.id);
    var specular = UI.get('specular', this.id);
    var shininess = UI.get('shininess', this.id);
    var clearCoat = UI.get('clearCoat', this.id);
    var clearCoatRoughness = UI.get('clearCoatRoughness', this.id);
    var vertexColors = UI.get('vertexColors', this.id);
    var skinning = UI.get('skinning', this.id);
    var mapEnabled = UI.get('mapEnabled', this.id);
    var map = UI.get('map', this.id);
    var alphaMapEnabled = UI.get('alphaMapEnabled', this.id);
    var alphaMap = UI.get('alphaMap', this.id);
    var bumpMapEnabled = UI.get('bumpMapEnabled', this.id);
    var bumpMap = UI.get('bumpMap', this.id);
    var bumpScale = UI.get('bumpScale', this.id);
    var normalMapEnabled = UI.get('normalMapEnabled', this.id);
    var normalMap = UI.get('normalMap', this.id);
    var displacementMapEnabled = UI.get('displacementMapEnabled', this.id);
    var displacementMap = UI.get('displacementMap', this.id);
    var displacementScale = UI.get('displacementScale', this.id);
    var roughnessMapEnabled = UI.get('roughnessMapEnabled', this.id);
    var roughnessMap = UI.get('roughnessMap', this.id);
    var metalnessMapEnabled = UI.get('metalnessMapEnabled', this.id);
    var metalnessMap = UI.get('metalnessMap', this.id);
    var specularMapEnabled = UI.get('specularMapEnabled', this.id);
    var specularMap = UI.get('specularMap', this.id);
    var envMapEnabled = UI.get('envMapEnabled', this.id);
    var envMap = UI.get('envMap', this.id);
    var reflectivity = UI.get('reflectivity', this.id);
    var lightMapEnabled = UI.get('lightMapEnabled', this.id);
    var lightMap = UI.get('lightMap', this.id);
    var aoMapEnabled = UI.get('aoMapEnabled', this.id);
    var aoMap = UI.get('aoMap', this.id);
    var aoScale = UI.get('aoScale', this.id);
    var emissiveMapEnabled = UI.get('emissiveMapEnabled', this.id);
    var emissiveMap = UI.get('emissiveMap', this.id);
    var side = UI.get('side', this.id);
    var flatShading = UI.get('flatShading', this.id);
    var blending = UI.get('blending', this.id);
    var opacity = UI.get('opacity', this.id);
    var transparent = UI.get('transparent', this.id);
    var alphaTest = UI.get('alphaTest', this.id);
    var wireframe = UI.get('wireframe', this.id);
    var wireframeLinewidth = UI.get('wireframeLinewidth', this.id);

    var material = this.selected.material;

    type.setValue(material.type);

    if (material.color) {
        color.setHexValue(material.color.getHexString());
    }

    if (material.roughness !== undefined) {
        roughness.setValue(material.roughness);
    }

    if (material.metalness !== undefined) {
        metalness.setValue(material.metalness);
    }

    if (material.emissive !== undefined) {
        emissive.setHexValue(material.emissive.getHexString());
    }

    if (material.specular !== undefined) {
        specular.setHexValue(material.specular.getHexString());
    }

    if (material.shininess !== undefined) {
        shininess.setValue(material.shininess);
    }

    if (material.clearCoat !== undefined) {
        clearCoat.setValue(material.clearCoat);
    }

    if (material.clearCoatRoughness !== undefined) {
        clearCoatRoughness.setValue(material.clearCoatRoughness);
    }

    if (material.vertexColors !== undefined) {
        vertexColors.setValue(material.vertexColors);
    }

    if (material.skinning !== undefined) {
        skinning.setValue(material.skinning);
    }

    if (material.map) {
        mapEnabled.setValue(material.map !== null);

        if (material.map !== null) {
            map.setValue(material.map);
        }
    }

    if (material.alphaMap !== undefined) {
        alphaMapEnabled.setValue(material.alphaMap !== null);

        if (material.alphaMap !== null) {
            alphaMap.setValue(material.alphaMap);
        }
    }

    if (material.bumpMap !== undefined) {
        bumpMapEnabled.setValue(material.bumpMap !== null);

        if (material.bumpMap !== null) {
            bumpMap.setValue(material.bumpMap);
            bumpScale.setValue(material.bumpScale);
        }
    }

    if (material.normalMap !== undefined) {
        normalMapEnabled.setValue(material.normalMap !== null);

        if (material.normalMap !== null) {
            normalMap.setValue(material.normalMap);
        }
    }

    if (material.displacementMap !== undefined) {
        displacementMapEnabled.setValue(material.displacementMap !== null);

        if (material.displacementMap !== null) {
            displacementMap.setValue(material.displacementMap);
            displacementScale.setValue(material.displacementScale);
        }
    }

    if (material.roughnessMap !== undefined) {
        roughnessMapEnabled.setValue(material.roughnessMap !== null);

        if (material.roughnessMap !== null) {
            roughnessMap.setValue(material.roughnessMap);
        }
    }

    if (material.metalnessMap !== undefined) {
        metalnessMapEnabled.setValue(material.metalnessMap !== null);

        if (material.metalnessMap !== null) {
            metalnessMap.setValue(material.metalnessMap);
        }
    }

    if (material.specularMap !== undefined) {
        specularMapEnabled.setValue(material.specularMap !== null);

        if (material.specularMap !== null) {
            specularMap.setValue(material.specularMap);
        }
    }

    if (material.envMap !== undefined) {
        envMapEnabled.setValue(material.envMap !== null);

        if (material.envMap !== null) {
            envMap.setValue(material.envMap);
        }
    }

    if (material.reflectivity !== undefined) {
        reflectivity.setValue(material.reflectivity);
    }

    if (material.lightMap !== undefined) {
        lightMapEnabled.setValue(material.lightMap !== null);

        if (material.lightMap !== null) {
            lightMap.setValue(material.lightMap);
        }
    }

    if (material.aoMap !== undefined) {
        aoMapEnabled.setValue(material.aoMap !== null);

        if (material.aoMap !== null) {
            aoMap.setValue(material.aoMap);
            aoScale.setValue(material.aoMapIntensity);
        }
    }

    if (material.emissiveMap !== undefined) {
        emissiveMapEnabled.setValue(material.emissiveMap !== null);

        if (material.emissiveMap !== null) {
            emissiveMap.setValue(material.emissiveMap);
        }
    }

    if (material.side !== undefined) {
        side.setValue(material.side);
    }

    if (material.flatShading !== undefined) {
        flatShading.setValue(material.flatShading);
    }

    if (material.blending !== undefined) {
        blending.setValue(material.blending);
    }

    if (material.opacity !== undefined) {
        opacity.setValue(material.opacity);
    }

    if (material.transparent !== undefined) {
        transparent.setValue(material.transparent);
    }

    if (material.alphaTest !== undefined) {
        alphaTest.setValue(material.alphaTest);
    }

    if (material.wireframe !== undefined) {
        wireframe.setValue(material.wireframe);
    }

    if (material.wireframeLinewidth !== undefined) {
        wireframeLinewidth.setValue(material.wireframeLinewidth);
    }
};

MaterialComponent.prototype.updateMaterial = function () {
    var type = UI.get('type', this.id);
    var color = UI.get('color', this.id);
    var roughness = UI.get('roughness', this.id);
    var metalness = UI.get('metalness', this.id);
    var emissive = UI.get('emissive', this.id);
    var specular = UI.get('specular', this.id);
    var shininess = UI.get('shininess', this.id);
    var clearCoat = UI.get('clearCoat', this.id);
    var clearCoatRoughness = UI.get('clearCoatRoughness', this.id);
    var vertexColors = UI.get('vertexColors', this.id);
    var skinning = UI.get('skinning', this.id);
    var mapEnabled = UI.get('mapEnabled', this.id);
    var map = UI.get('map', this.id);
    var alphaMapEnabled = UI.get('alphaMapEnabled', this.id);
    var alphaMap = UI.get('alphaMap', this.id);
    var bumpMapEnabled = UI.get('bumpMapEnabled', this.id);
    var bumpMap = UI.get('bumpMap', this.id);
    var bumpScale = UI.get('bumpScale', this.id);
    var normalMapEnabled = UI.get('normalMapEnabled', this.id);
    var normalMap = UI.get('normalMap', this.id);
    var displacementMapEnabled = UI.get('displacementMapEnabled', this.id);
    var displacementMap = UI.get('displacementMap', this.id);
    var displacementScale = UI.get('displacementScale', this.id);
    var roughnessMapEnabled = UI.get('roughnessMapEnabled', this.id);
    var roughnessMap = UI.get('roughnessMap', this.id);
    var metalnessMapEnabled = UI.get('metalnessMapEnabled', this.id);
    var metalnessMap = UI.get('metalnessMap', this.id);
    var specularMapEnabled = UI.get('specularMapEnabled', this.id);
    var specularMap = UI.get('specularMap', this.id);
    var envMapEnabled = UI.get('envMapEnabled', this.id);
    var envMap = UI.get('envMap', this.id);
    var reflectivity = UI.get('reflectivity', this.id);
    var lightMapEnabled = UI.get('lightMapEnabled', this.id);
    var lightMap = UI.get('lightMap', this.id);
    var aoMapEnabled = UI.get('aoMapEnabled', this.id);
    var aoMap = UI.get('aoMap', this.id);
    var aoScale = UI.get('aoScale', this.id);
    var emissiveMapEnabled = UI.get('emissiveMapEnabled', this.id);
    var emissiveMap = UI.get('emissiveMap', this.id);
    var side = UI.get('side', this.id);
    var flatShading = UI.get('flatShading', this.id);
    var blending = UI.get('blending', this.id);
    var opacity = UI.get('opacity', this.id);
    var transparent = UI.get('transparent', this.id);
    var alphaTest = UI.get('alphaTest', this.id);
    var wireframe = UI.get('wireframe', this.id);
    var wireframeLinewidth = UI.get('wireframeLinewidth', this.id);

    var editor = this.app.editor;
    var object = this.selected;
    var geometry = object.geometry;
    var material = object.material;

    var textureWarning = false;
    var objectHasUvs = false;

    if (object instanceof THREE.Sprite) {
        objectHasUvs = true;
    }

    if (geometry instanceof THREE.Geometry && geometry.faceVertexUvs[0].length > 0) {
        objectHasUvs = true;
    }

    if (geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) {
        objectHasUvs = true;
    }

    if (material instanceof THREE[type.getValue()] === false) {
        material = new THREE[type.getValue()]();

        if (material instanceof THREE.ShaderMaterial) {
            material.uniforms = {
                time: {
                    value: 1.0
                }
            };
            material.vertexShader = ShaderMaterialVertex;
            material.fragmentShader = ShaderMaterialFragment;
        }

        if (material instanceof THREE.RawShaderMaterial) {
            material.uniforms = {
                time: {
                    value: 1.0
                }
            };
            material.vertexShader = RawShaderMaterialVertex;
            material.fragmentShader = RawShaderMaterialFragment;
        }

        editor.execute(new SetMaterialCommand(object, material), '新材质：' + type.getValue());
    }

    if (material.color !== undefined && material.color.getHex() !== color.getHexValue()) {
        editor.execute(new SetMaterialColorCommand(object, 'color', color.getHexValue()));
    }

    if (material.roughness !== undefined && Math.abs(material.roughness - roughness.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'roughness', roughness.getValue()));
    }

    if (material.metalness !== undefined && Math.abs(material.metalness - metalness.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'metalness', metalness.getValue()));
    }

    if (material.emissive !== undefined && material.emissive.getHex() !== emissive.getHexValue()) {
        editor.execute(new SetMaterialColorCommand(object, 'emissive', emissive.getHexValue()));
    }

    if (material.specular !== undefined && material.specular.getHex() !== specular.getHexValue()) {
        editor.execute(new SetMaterialColorCommand(object, 'specular', specular.getHexValue()));
    }

    if (material.shininess !== undefined && Math.abs(material.shininess - shininess.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'shininess', shininess.getValue()));
    }

    if (material.clearCoat !== undefined && Math.abs(material.clearCoat - clearCoat.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'clearCoat', clearCoat.getValue()));
    }

    if (material.clearCoatRoughness !== undefined && Math.abs(material.clearCoatRoughness - clearCoatRoughness.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'clearCoatRoughness', clearCoatRoughness.getValue()));
    }

    if (material.vertexColors !== undefined) {
        if (material.vertexColors !== parseInt(vertexColors.getValue())) {
            editor.execute(new SetMaterialValueCommand(object, 'vertexColors', parseInt(vertexColors.getValue())));
        }
    }

    if (material.skinning !== undefined && material.skinning !== skinning.getValue()) {
        editor.execute(new SetMaterialValueCommand(object, 'skinning', skinning.getValue()));
    }

    if (material.map !== undefined) {
        var mapEnabled = mapEnabled.getValue() === true;
        if (objectHasUvs) {
            var map = mapEnabled ? map.getValue() : null;
            if (material.map !== map) {
                editor.execute(new SetMaterialMapCommand(object, 'map', map));
            }
        } else {
            if (mapEnabled) textureWarning = true;
        }
    }

    if (material.alphaMap !== undefined) {
        var mapEnabled = alphaMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var alphaMap = mapEnabled ? alphaMap.getValue() : null;

            if (material.alphaMap !== alphaMap) {
                editor.execute(new SetMaterialMapCommand(object, 'alphaMap', alphaMap));
            }
        } else {
            if (mapEnabled) textureWarning = true;
        }
    }

    if (material.bumpMap !== undefined) {
        var bumpMapEnabled = bumpMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var bumpMap = bumpMapEnabled ? bumpMap.getValue() : null;

            if (material.bumpMap !== bumpMap) {
                editor.execute(new SetMaterialMapCommand(object, 'bumpMap', bumpMap));
            }

            if (material.bumpScale !== bumpScale.getValue()) {
                editor.execute(new SetMaterialValueCommand(object, 'bumpScale', bumpScale.getValue()));
            }
        } else {
            if (bumpMapEnabled) textureWarning = true;
        }
    }

    if (material.normalMap !== undefined) {
        var normalMapEnabled = normalMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var normalMap = normalMapEnabled ? normalMap.getValue() : null;

            if (material.normalMap !== normalMap) {
                editor.execute(new SetMaterialMapCommand(object, 'normalMap', normalMap));
            }
        } else {
            if (normalMapEnabled) textureWarning = true;
        }
    }

    if (material.displacementMap !== undefined) {
        var displacementMapEnabled = displacementMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var displacementMap = displacementMapEnabled ? displacementMap.getValue() : null;

            if (material.displacementMap !== displacementMap) {
                editor.execute(new SetMaterialMapCommand(object, 'displacementMap', displacementMap));
            }

            if (material.displacementScale !== displacementScale.getValue()) {
                editor.execute(new SetMaterialValueCommand(object, 'displacementScale', displacementScale.getValue()));
            }
        } else {
            if (displacementMapEnabled) textureWarning = true;
        }

    }

    if (material.roughnessMap !== undefined) {
        var roughnessMapEnabled = roughnessMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var roughnessMap = roughnessMapEnabled ? roughnessMap.getValue() : null;

            if (material.roughnessMap !== roughnessMap) {
                editor.execute(new SetMaterialMapCommand(object, 'roughnessMap', roughnessMap));
            }
        } else {
            if (roughnessMapEnabled) textureWarning = true;
        }
    }

    if (material.metalnessMap !== undefined) {
        var metalnessMapEnabled = metalnessMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var metalnessMap = metalnessMapEnabled ? metalnessMap.getValue() : null;

            if (material.metalnessMap !== metalnessMap) {
                editor.execute(new SetMaterialMapCommand(object, 'metalnessMap', metalnessMap));
            }
        } else {
            if (metalnessMapEnabled) textureWarning = true;
        }
    }

    if (material.specularMap !== undefined) {
        var specularMapEnabled = specularMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var specularMap = specularMapEnabled ? specularMap.getValue() : null;

            if (material.specularMap !== specularMap) {
                editor.execute(new SetMaterialMapCommand(object, 'specularMap', specularMap));
            }
        } else {
            if (specularMapEnabled) textureWarning = true;
        }
    }

    if (material.envMap !== undefined) {
        var envMapEnabled = envMapEnabled.getValue() === true;
        var envMap = envMapEnabled ? envMap.getValue() : null;

        if (material.envMap !== envMap) {
            editor.execute(new SetMaterialMapCommand(object, 'envMap', envMap));
        }
    }

    if (material.reflectivity !== undefined) {
        var reflectivity = reflectivity.getValue();

        if (material.reflectivity !== reflectivity) {
            editor.execute(new SetMaterialValueCommand(object, 'reflectivity', reflectivity));
        }
    }

    if (material.lightMap !== undefined) {
        var lightMapEnabled = lightMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var lightMap = lightMapEnabled ? lightMap.getValue() : null;

            if (material.lightMap !== lightMap) {
                editor.execute(new SetMaterialMapCommand(object, 'lightMap', lightMap));
            }
        } else {
            if (lightMapEnabled) textureWarning = true;
        }
    }

    if (material.aoMap !== undefined) {
        var aoMapEnabled = aoMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var aoMap = aoMapEnabled ? aoMap.getValue() : null;

            if (material.aoMap !== aoMap) {
                editor.execute(new SetMaterialMapCommand(object, 'aoMap', aoMap));
            }

            if (material.aoMapIntensity !== aoScale.getValue()) {
                editor.execute(new SetMaterialValueCommand(object, 'aoMapIntensity', aoScale.getValue()));
            }
        } else {
            if (aoMapEnabled) textureWarning = true;
        }
    }

    if (material.emissiveMap !== undefined) {
        var emissiveMapEnabled = emissiveMapEnabled.getValue() === true;

        if (objectHasUvs) {
            var emissiveMap = emissiveMapEnabled ? emissiveMap.getValue() : null;

            if (material.emissiveMap !== emissiveMap) {
                editor.execute(new SetMaterialMapCommand(object, 'emissiveMap', emissiveMap));
            }
        } else {
            if (emissiveMapEnabled) textureWarning = true;
        }
    }

    if (material.side !== undefined) {
        var side = parseInt(side.getValue());

        if (material.side !== side) {
            editor.execute(new SetMaterialValueCommand(object, 'side', side));
        }
    }

    if (material.flatShading !== undefined) {
        var flatShading = flatShading.getValue();

        if (material.flatShading != flatShading) {
            editor.execute(new SetMaterialValueCommand(object, 'flatShading', flatShading));
        }
    }

    if (material.blending !== undefined) {
        var blending = parseInt(blending.getValue());

        if (material.blending !== blending) {
            editor.execute(new SetMaterialValueCommand(object, 'blending', blending));
        }
    }

    if (material.opacity !== undefined && Math.abs(material.opacity - opacity.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'opacity', opacity.getValue()));
    }

    if (material.transparent !== undefined && material.transparent !== transparent.getValue()) {
        editor.execute(new SetMaterialValueCommand(object, 'transparent', transparent.getValue()));
    }

    if (material.alphaTest !== undefined && Math.abs(material.alphaTest - alphaTest.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'alphaTest', alphaTest.getValue()));
    }

    if (material.wireframe !== undefined && material.wireframe !== wireframe.getValue()) {
        editor.execute(new SetMaterialValueCommand(object, 'wireframe', wireframe.getValue()));
    }

    if (material.wireframeLinewidth !== undefined && Math.abs(material.wireframeLinewidth - wireframeLinewidth.getValue()) >= 0.01) {
        editor.execute(new SetMaterialValueCommand(object, 'wireframeLinewidth', wireframeLinewidth.getValue()));
    }

    this.updateUI();

    if (textureWarning) {
        console.warn(`无法设置纹理，${this.selected.name}的材质没有纹理坐标！`);
    }
};

MaterialComponent.prototype.editProgramInfo = function () {
    var material = this.selected.material;

    var obj = {
        defines: material.defines,
        uniforms: material.uniforms,
        attributes: material.attributes
    };

    this.app.script.open(material.uuid, this.selected.name + '-ProgramInfo', 'json', JSON.stringify(obj), this.selected.name + '-着色器信息', source => {
        try {
            obj = JSON.parse(source);
            material.defines = obj.defines;
            material.uniforms = obj.uniforms;
            material.attributes = obj.attributes;
            material.needsUpdate = true;
        } catch (e) {
            this.app.error(this.selected.name + '-着色器信息 无法反序列化。');
        }
    });
};

MaterialComponent.prototype.editVertexShader = function () {
    var material = this.selected.material;

    this.app.script.open(material.uuid, this.selected.name + '-VertexShader', 'vertexShader', material.vertexShader, this.selected.name + '-顶点着色器', source => {
        material.vertexShader = source;
        material.needsUpdate = true;
    });
};

MaterialComponent.prototype.editFragmentShader = function () {
    var material = this.selected.material;

    this.app.script.open(material.uuid, this.selected.name + '-FragmentShader', 'fragmentShader', material.fragmentShader, this.selected.name + '-片源着色器', source => {
        material.fragmentShader = source;
        material.needsUpdate = true;
    });
};

MaterialComponent.prototype.onSetMap = function () {
    if (this.mapSettingWindow === undefined) {
        this.mapSettingWindow = new TextureSettingWindow({
            app: this.app
        });
        this.mapSettingWindow.render();
    }

    if (!this.selected.material.map) {
        UI.msg('请先为该物体选择纹理！');
        return;
    }

    this.mapSettingWindow.setData(this.selected.material.map);
    this.mapSettingWindow.show();
};

// --------------------------------------- 材质保存载入 --------------------------------------------------

MaterialComponent.prototype.onSave = function () {
    UI.prompt('请输入材质名称', '名称', '新材质', (event, value) => {
        this.commitSave(value);
    });
};

MaterialComponent.prototype.commitSave = function (name) {
    var material = this.selected.material;
    var data = (new MaterialsSerializer()).toJSON(material);

    // 材质球图片
    var dataURL = MaterialUtils.createMaterialImage(material).toDataURL('image/png');

    var file = Converter.dataURLtoFile(dataURL, name);

    // 上传图片
    Ajax.post(`${this.app.options.server}/api/Upload/Upload`, {
        file: file
    }, result => {
        var obj = JSON.parse(result);
        Ajax.post(`/api/Material/Save`, {
            Name: name,
            Data: JSON.stringify(data),
            Thumbnail: obj.Data.url
        }, result => {
            var obj = JSON.parse(result);
            if (obj.Code === 200) {
                this.app.call(`showBottomPanel`, this, 'material');
            }
            UI.msg(obj.Msg);
        });
    });
};

MaterialComponent.prototype.onLoad = function () {
    this.app.call(`selectBottomPanel`, this, 'material');
    UI.msg('请点击材质面板中的材质！');
    this.app.on(`selectMaterial.${this.id}`, this.onWaitingForMaterial.bind(this));
};

MaterialComponent.prototype.onWaitingForMaterial = function (material) {
    this.app.on(`selectMaterial.${this.id}`, null);

    if (this.selected.material) {
        this.selected.material.dispose();
    }

    this.selected.material = material;

    this.app.call('objectChanged', this, this.selected);
};

export default MaterialComponent;