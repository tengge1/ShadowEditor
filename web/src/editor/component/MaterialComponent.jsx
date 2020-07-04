/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, ButtonProperty, SelectProperty, ButtonsProperty, Button, ColorProperty, NumberProperty, TextureProperty } from '../../ui/index';
import SetMaterialCommand from '../../command/SetMaterialCommand';
import SetMaterialColorCommand from '../../command/SetMaterialColorCommand';
import SetMaterialValueCommand from '../../command/SetMaterialValueCommand';
import SetMaterialMapCommand from '../../command/SetMaterialMapCommand';
import ShaderMaterialVertex from './shader/shader_material_vertex.glsl';
import ShaderMaterialFragment from './shader/shader_material_fragment.glsl';
import RawShaderMaterialVertex from './shader/raw_shader_material_vertex.glsl';
import RawShaderMaterialFragment from './shader/raw_shader_material_fragment.glsl';

import TextureSettingWindow from './window/TextureSettingWindow.jsx';

import MaterialsSerializer from '../../serialization/material/MaterialsSerializer';
import MaterialUtils from '../../utils/MaterialUtils';

import Ajax from '../../utils/Ajax';
import Converter from '../../utils/Converter';

/**
 * 材质组件
 * @author tengge / https://github.com/tengge1
 */
class MaterialComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.materialIndex = 0;
        this.material = null;

        this.materials = {
            'LineBasicMaterial': _t('LineBasicMaterial'),
            'LineDashedMaterial': _t('LineDashedMaterial'),
            'MeshBasicMaterial': _t('MeshBasicMaterial'),
            'MeshDepthMaterial': _t('MeshDepthMaterial'),
            'MeshNormalMaterial': _t('MeshNormalMaterial'),
            'MeshLambertMaterial': _t('MeshLambertMaterial'),
            'MeshPhongMaterial': _t('MeshPhongMaterial'),
            'PointsMaterial': _t('PointCloudMaterial'),
            'MeshStandardMaterial': _t('MeshStandardMaterial'),
            'MeshPhysicalMaterial': _t('MeshPhysicalMaterial'),
            'SpriteMaterial': _t('SpriteMaterial'),
            'ShaderMaterial': _t('ShaderMaterial'),
            'RawShaderMaterial': _t('RawShaderMaterial')
        };

        this.vertexColors = {
            0: _t('No Colors'),
            1: _t('Face Colors'),
            2: _t('Vertex Colors')
        };

        this.side = {
            0: _t('Front Side'),
            1: _t('Back Side'),
            2: _t('Double Side')
        };

        this.blending = {
            0: _t('No Blending'),
            1: _t('Normal Blending'),
            2: _t('Additive Blending'),
            3: _t('Substractive Blending'),
            4: _t('Multiply Blending'),
            5: _t('Custom Blending')
        };

        this.mapNames = [ // 用于判断属性是否是纹理
            'map',
            'alphaMap',
            'bumpMap',
            'normalMap',
            'displacementMap',
            'roughnessMap',
            'metalnessMap',
            'specularMap',
            'envMap',
            'lightMap',
            'aoMap',
            'emissiveMap'
        ];

        this.state = {
            show: false,
            expanded: false,

            type: null,

            showProgram: false,

            showColor: false,
            color: null,

            showRoughness: false,
            roughness: null,

            showMetalness: false,
            metalness: null,

            showEmissive: false,
            emissive: null,

            showSpecular: false,
            specular: null,

            showShininess: false,
            shininess: null,

            showClearCoat: false,
            clearCoat: null,

            showClearCoatRoughness: false,
            clearCoatRoughness: null,

            showVertexColors: false,
            vertexColors: null,

            showSkinning: false,
            skinning: null,

            showMap: false,
            map: null,

            showAlphaMap: false,
            alphaMap: null,

            showBumpMap: false,
            bumpMap: null,
            bumpScale: null,

            showNormalMap: false,
            normalMap: null,

            showDisplacementMap: false,
            displacementMap: null,
            displacementScale: null,

            showRoughnessMap: false,
            roughnessMap: null,

            showMetalnessMap: false,
            metalnessMap: null,

            showSpecularMap: false,
            specularMap: null,

            showEnvMap: false,
            envMap: null,

            envMapIntensity: null,

            showLightMap: false,
            lightMap: null,

            showAoMap: false,
            aoMap: null,
            aoScale: null,

            showEmissiveMap: false,
            emissiveMap: null,

            showSide: false,
            side: null,

            showFlatShading: false,
            flatShading: null,

            showBlending: false,
            blending: null,

            showOpacity: false,
            opacity: 1,

            showTransparent: false,
            transparent: false,

            showAlphaTest: false,
            alphaTest: 1,

            showWireframe: false,
            wireframe: false,
            wireframeLinewidth: 1
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCurrentMaterialChange = this.handleCurrentMaterialChange.bind(this);
        this.handleMaterial = this.handleMaterial.bind(this);

        this.handleChange = this.handleChange.bind(this);

        this.handleTextureSetting = this.handleTextureSetting.bind(this);

        this.editProgramInfo = this.editProgramInfo.bind(this);
        this.saveProgramInfo = this.saveProgramInfo.bind(this);

        this.editVertexShader = this.editVertexShader.bind(this);
        this.saveVertexShader = this.saveVertexShader.bind(this);

        this.editFragmentShader = this.editFragmentShader.bind(this);
        this.saveFragmentShader = this.saveFragmentShader.bind(this);

        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    render() {
        const { show, expanded, type, showProgram, showColor, color, showRoughness, roughness, showMetalness, metalness, showEmissive, emissive, showSpecular, specular, showShininess, shininess, showClearCoat, clearCoat, showClearCoatRoughness, clearCoatRoughness, showVertexColors, vertexColors, showSkinning, skinning,
            showMap, map, showAlphaMap, alphaMap, showBumpMap, bumpMap, bumpScale, showNormalMap, normalMap, showDisplacementMap, displacementMap,
            displacementScale, showRoughnessMap, roughnessMap, showMetalnessMap, metalnessMap, showSpecularMap, specularMap, showEnvMap, envMap,
            envMapIntensity, showLightMap, lightMap, showAoMap, aoMap, aoScale, showEmissiveMap, emissiveMap, side, flatShading, blending, opacity, transparent,
            alphaTest, wireframe, wireframeLinewidth } = this.state;
        const { enableAuthority, authorities } = app.server;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Material Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <ButtonsProperty label={''}>
                <Button show={!enableAuthority || authorities.includes('SAVE_MATERIAL')}
                    onClick={this.onSave}
                >{_t('Save')}</Button>
                <Button show={!enableAuthority || authorities.includes('LIST_MATERIAL')}
                    onClick={this.onLoad}
                >{_t('Select')}</Button>
            </ButtonsProperty>
            <SelectProperty label={_t('Type')}
                options={this.materials}
                name={'type'}
                value={type}
                onChange={this.handleChange}
            />
            <ButtonProperty label={_t('ShaderInfo')}
                text={_t('Edit')}
                show={showProgram}
                onChange={this.editProgramInfo}
            />
            <ButtonProperty label={_t('Vertex Shader')}
                text={_t('Edit')}
                show={showProgram}
                onChange={this.editVertexShader}
            />
            <ButtonProperty label={_t('Frag Shader')}
                text={_t('Edit')}
                show={showProgram}
                onChange={this.editFragmentShader}
            />
            <ColorProperty label={_t('Color')}
                name={'color'}
                value={color}
                show={showColor}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Roughness')}
                name={'roughness'}
                value={roughness}
                show={showRoughness}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MetalNess')}
                name={'metalness'}
                value={metalness}
                show={showMetalness}
                onChange={this.handleChange}
            />
            <ColorProperty label={_t('Emissive')}
                name={'emissive'}
                value={emissive}
                show={showEmissive}
                onChange={this.handleChange}
            />
            <ColorProperty label={_t('Specular')}
                name={'specular'}
                value={specular}
                show={showSpecular}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Shininess')}
                name={'shininess'}
                value={shininess}
                show={showShininess}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('ClearCoat')}
                name={'clearCoat'}
                value={clearCoat}
                show={showClearCoat}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('ClearCoatRoughness')}
                name={'clearCoatRoughness'}
                value={clearCoatRoughness}
                show={showClearCoatRoughness}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Vertex Color')}
                options={this.vertexColors}
                name={'vertexColors'}
                value={vertexColors}
                show={showVertexColors}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Skin')}
                name={'skinning'}
                value={skinning}
                show={showSkinning}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('Map')}
                name={'map'}
                value={map}
                show={showMap}
                onChange={this.handleChange}
            />
            <ButtonProperty text={_t('Texture Settings')}
                onChange={this.handleTextureSetting}
            />
            <TextureProperty label={_t('AlphaMap')}
                name={'alphaMap'}
                value={alphaMap}
                show={showAlphaMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('BumpMap')}
                name={'bumpMap'}
                value={bumpMap}
                show={showBumpMap}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Bump Scale')}
                name={'bumpScale'}
                value={bumpScale}
                show={showBumpMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('NormalMap')}
                name={'normalMap'}
                value={normalMap}
                show={showNormalMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('DisplacementMap')}
                name={'displacementMap'}
                value={displacementMap}
                show={showDisplacementMap}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Displace Scale')}
                name={'displacementScale'}
                value={displacementScale}
                show={showDisplacementMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('RoughnessMap')}
                name={'roughnessMap'}
                value={roughnessMap}
                show={showRoughnessMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('MetalnessMap')}
                name={'metalnessMap'}
                value={metalnessMap}
                show={showMetalnessMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('SpecularMap')}
                name={'specularMap'}
                value={specularMap}
                show={showSpecularMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('EnvMap')}
                name={'envMap'}
                value={envMap}
                show={showEnvMap}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('EnvMapIntensity')}
                name={'envMapIntensity'}
                value={envMapIntensity}
                show={showEnvMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('LightMap')}
                name={'lightMap'}
                value={lightMap}
                show={showLightMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('AoMap')}
                name={'aoMap'}
                value={aoMap}
                show={showAoMap}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Ao Scale')}
                name={'aoScale'}
                value={aoScale}
                show={showAoMap}
                onChange={this.handleChange}
            />
            <TextureProperty label={_t('EmissiveMap')}
                name={'emissiveMap'}
                value={emissiveMap}
                show={showEmissiveMap}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Side')}
                options={this.side}
                name={'side'}
                value={side}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Flat Shading')}
                name={'flatShading'}
                value={flatShading}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Blending')}
                options={this.blending}
                name={'blending'}
                value={blending}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Opacity')}
                name={'opacity'}
                value={opacity}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Transparent')}
                name={'transparent'}
                value={transparent}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('AlphaTest')}
                name={'alphaTest'}
                value={alphaTest}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Wireframe')}
                name={'wireframe'}
                value={wireframe}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('WireWidth')}
                name={'wireframeLinewidth'}
                value={wireframeLinewidth}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MaterialComponent`, this.handleUpdate);
        app.on(`objectChanged.MaterialComponent`, this.handleUpdate);
        app.on(`currentMaterialChange.MaterialComponent`, this.handleCurrentMaterialChange); // 多材质组件
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !editor.selected.material) {
            this.setState({
                show: false
            });
            return;
        }

        if (Array.isArray(editor.selected.material)) { // 多材质模型，由多材质组件选择。
            return;
        }

        this.selected = editor.selected;
        this.materialIndex = 0;
        this.material = this.selected.material;

        this.handleMaterial(this.material);
    }

    handleCurrentMaterialChange(material, index, materials, selected) { // 多材质组件材质改变
        this.selected = selected;
        this.materialIndex = index;
        this.handleMaterial(material);
    }

    handleMaterial(material) {
        let state = {
            show: true,
            type: material.type,
            showProgram: material instanceof THREE.ShaderMaterial || material instanceof THREE.RawShaderMaterial
        };

        if (material.color) {
            state.showColor = true;
            state.color = `#${material.color.getHexString()}`;
        } else {
            state.showColor = false;
        }

        if (material.roughness !== undefined) {
            state.showRoughness = true;
            state.roughness = material.roughness;
        } else {
            state.showRoughness = false;
        }

        if (material.metalness !== undefined) {
            state.showMetalness = true;
            state.metalness = material.metalness;
        } else {
            state.showMetalness = false;
        }

        if (material.emissive !== undefined) {
            state.showEmissive = true;
            state.emissive = `#${material.emissive.getHexString()}`;
        } else {
            state.showEmissive = false;
        }

        if (material.specular !== undefined) {
            state.showSpecular = true;
            state.specular = `#${material.specular.getHexString()}`;
        } else {
            state.showSpecular = false;
        }

        if (material.shininess !== undefined) {
            state.showShininess = true;
            state.shininess = material.shininess;
        } else {
            state.showShininess = false;
        }

        if (material.clearCoat !== undefined) {
            state.showClearCoat = true;
            state.clearCoat = material.clearCoat;
        } else {
            state.showClearCoat = false;
        }

        if (material.clearCoatRoughness !== undefined) {
            state.showClearCoatRoughness = true;
            state.clearCoatRoughness = material.clearCoatRoughness;
        } else {
            state.showClearCoatRoughness = false;
        }

        if (material.vertexColors !== undefined) {
            state.showVertexColors = true;
            state.vertexColors = material.vertexColors;
        } else {
            state.showVertexColors = false;
        }

        if (material.skinning !== undefined) {
            state.showSkinning = true;
            state.skinning = material.skinning;
        } else {
            state.showSkinning = false;
        }

        if (material.map !== undefined) {
            state.showMap = true;
            state.map = material.map;
        } else {
            state.showMap = false;
        }

        if (material.alphaMap !== undefined) {
            state.showAlphaMap = true;
            state.alphaMap = material.alphaMap;
        } else {
            state.showAlphaMap = false;
        }

        if (material.bumpMap !== undefined) {
            state.showBumpMap = true;
            state.bumpMap = material.bumpMap;
            state.bumpScale = material.bumpScale;
        } else {
            state.showBumpMap = false;
        }

        if (material.normalMap !== undefined) {
            state.showNormalMap = true;
            state.normalMap = material.normalMap;
        } else {
            state.showNormalMap = false;
        }

        if (material.displacementMap !== undefined) {
            state.showDisplacementMap = true;
            state.displacementMap = material.displacementMap;
            state.displacementScale = material.displacementScale;
        } else {
            state.showDisplacementMap = false;
        }

        if (material.roughnessMap !== undefined) {
            state.showRoughnessMap = true;
            state.roughnessMap = material.roughnessMap;
        } else {
            state.showRoughnessMap = false;
        }

        if (material.metalnessMap !== undefined) {
            state.showMetalnessMap = true;
            state.metalnessMap = material.metalnessMap;
        } else {
            state.showMetalnessMap = false;
        }

        if (material.specularMap !== undefined) {
            state.showSpecularMap = true;
            state.specularMap = material.specularMap;
        } else {
            state.showSpecularMap = false;
        }

        if (material.envMap !== undefined) {
            state.showEnvMap = true;
            state.envMap = material.envMap;

            if (material.envMapIntensity !== undefined) {
                state.envMapIntensity = material.envMapIntensity;
            }
        } else {
            state.showEnvMap = false;
        }

        if (material.lightMap !== undefined) {
            state.showLightMap = true;
            state.lightMap = material.lightMap;
        } else {
            state.showLightMap = false;
        }

        if (material.aoMap !== undefined) {
            state.showAoMap = true;
            state.aoMap = material.aoMap;
            state.aoScale = material.aoMapIntensity;
        } else {
            state.showAoMap = false;
        }

        if (material.emissiveMap !== undefined) {
            state.showEmissiveMap = true;
            state.emissiveMap = material.emissiveMap;
        } else {
            state.showEmissiveMap = false;
        }

        if (material.side !== undefined) {
            state.side = material.side;
        }

        if (material.flatShading !== undefined) {
            state.flatShading = material.flatShading;
        }

        if (material.blending !== undefined) {
            state.blending = material.blending;
        }

        if (material.opacity !== undefined) {
            state.opacity = material.opacity;
        }

        if (material.transparent !== undefined) {
            state.transparent = material.transparent;
        }

        if (material.alphaTest !== undefined) {
            state.alphaTest = material.alphaTest;
        }

        if (material.wireframe !== undefined) {
            state.wireframe = material.wireframe;
        }

        if (material.wireframeLinewidth !== undefined) {
            state.wireframeLinewidth = material.wireframeLinewidth;
        }

        this.setState(state);
    }

    handleChange(value, name) {
        // 当name是纹理时，value为null表示不显示纹理，不应该跳过。
        if (value === null && this.mapNames.indexOf(name) === -1) {
            this.setState({
                [name]: value
            });
            return;
        }

        const editor = app.editor;
        let object = this.selected;
        let material = this.material;

        const { type, color, roughness, metalness, emissive, specular, shininess, clearCoat, clearCoatRoughness, vertexColors, skinning, map, alphaMap,
            bumpMap, bumpScale, normalMap, displacementMap, displacementScale, roughnessMap, metalnessMap, specularMap, envMap, envMapIntensity, lightMap,
            aoMap, aoScale, emissiveMap, side, flatShading, blending, opacity, transparent, alphaTest, wireframe, wireframeLinewidth } = Object.assign({}, this.state, {
                [name]: value
            });

        if (material instanceof THREE[type] === false) {
            material = new THREE[type]();

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

            editor.execute(new SetMaterialCommand(object, material), _t('New Material') + ':' + type);
        }

        if (material.color !== undefined && `#${material.color.getHexString()}` !== color) {
            editor.execute(new SetMaterialColorCommand(object, 'color', color));
        }

        if (material.roughness !== undefined && Math.abs(material.roughness - roughness) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'roughness', roughness));
        }

        if (material.metalness !== undefined && Math.abs(material.metalness - metalness) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'metalness', metalness));
        }

        if (material.emissive !== undefined && `#${material.emissive.getHexString()}` !== emissive) {
            editor.execute(new SetMaterialColorCommand(object, 'emissive', emissive));
        }

        // bug: 切换材质时，由于新材质有specular属性，旧材质没有specular属性，可能会导致报错。
        if (material.specular !== undefined && `#${material.specular.getHexString()}` !== specular && specular !== null) {
            editor.execute(new SetMaterialValueCommand(object, 'specular', specular));
        }

        if (material.shininess !== undefined && Math.abs(material.shininess - shininess) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'shininess', shininess));
        }

        if (material.clearCoat !== undefined && Math.abs(material.clearCoat - clearCoat) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'clearCoat', clearCoat));
        }

        if (material.clearCoatRoughness !== undefined && Math.abs(material.clearCoatRoughness - clearCoatRoughness) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'clearCoatRoughness', clearCoatRoughness));
        }

        if (material.vertexColors !== undefined && material.vertexColors !== vertexColors) {
            editor.execute(new SetMaterialValueCommand(object, 'vertexColors', vertexColors));
        }

        if (material.skinning !== undefined && material.skinning !== skinning) {
            editor.execute(new SetMaterialValueCommand(object, 'skinning', skinning));
        }

        if (name === 'map' && material.map !== undefined) {
            if (material.map !== map) {
                editor.execute(new SetMaterialMapCommand(object, 'map', map));
            }
        }

        if (name === 'alphaMap' && material.alphaMap !== undefined) {
            if (material.alphaMap !== alphaMap) {
                editor.execute(new SetMaterialMapCommand(object, 'alphaMap', alphaMap));
            }
        }

        if (name === 'bumpMap' && material.bumpMap !== undefined) {
            if (material.bumpMap !== bumpMap) {
                editor.execute(new SetMaterialMapCommand(object, 'bumpMap', bumpMap));
            }
        }

        if (name === 'bumpScale' && material.bumpScale !== undefined) {
            editor.execute(new SetMaterialValueCommand(object, 'bumpScale', bumpScale));
        }

        if (name === 'normalMap' && material.normalMap !== undefined) {
            if (material.normalMap !== normalMap) {
                editor.execute(new SetMaterialMapCommand(object, 'normalMap', normalMap));
            }
        }

        if (name === 'displacementMap' && material.displacementMap !== undefined) {
            if (material.displacementMap !== displacementMap) {
                editor.execute(new SetMaterialMapCommand(object, 'displacementMap', displacementMap));
            }
        }

        if (name === 'displacementScale' && material.displacementScale !== undefined) {
            editor.execute(new SetMaterialValueCommand(object, 'displacementScale', displacementScale));
        }

        if (name === 'roughnessMap' && material.roughnessMap !== undefined) {
            if (material.roughnessMap !== roughnessMap) {
                editor.execute(new SetMaterialMapCommand(object, 'roughnessMap', roughnessMap));
            }
        }

        if (name === 'metalnessMap' && material.metalnessMap !== undefined) {
            if (material.metalnessMap !== metalnessMap) {
                editor.execute(new SetMaterialMapCommand(object, 'metalnessMap', metalnessMap));
            }
        }

        if (name === 'specularMap' && material.specularMap !== undefined) {
            if (material.specularMap !== specularMap) {
                editor.execute(new SetMaterialMapCommand(object, 'specularMap', specularMap));
            }
        }

        if (name === 'envMap' && material.envMap !== undefined) {
            if (material.envMap !== envMap) {
                editor.execute(new SetMaterialMapCommand(object, 'envMap', envMap));
            }
        }

        if (name === 'envMapIntensity' && material.envMapIntensity !== undefined) {
            editor.execute(new SetMaterialValueCommand(object, 'envMapIntensity', envMapIntensity));
        }

        if (name === 'lightMap' && material.lightMap !== undefined) {
            if (material.lightMap !== lightMap) {
                editor.execute(new SetMaterialMapCommand(object, 'lightMap', lightMap));
            }
        }

        if (name === 'aoMap' && material.aoMap !== undefined) {
            if (material.aoMap !== aoMap) {
                editor.execute(new SetMaterialMapCommand(object, 'aoMap', aoMap));
            }
        }

        if (name === 'aoScale' && material.aoMapIntensity !== undefined) {
            editor.execute(new SetMaterialValueCommand(object, 'aoMapIntensity', aoScale));
        }

        if (name === 'emissiveMap' && material.emissiveMap !== undefined) {
            if (material.emissiveMap !== emissiveMap) {
                editor.execute(new SetMaterialMapCommand(object, 'emissiveMap', emissiveMap));
            }
        }

        if (material.side !== undefined && material.side !== side) {
            editor.execute(new SetMaterialValueCommand(object, 'side', side));
        }

        if (material.flatShading !== undefined && material.flatShading !== flatShading) {
            editor.execute(new SetMaterialValueCommand(object, 'flatShading', flatShading));
        }

        if (material.blending !== undefined && material.blending !== blending) {
            editor.execute(new SetMaterialValueCommand(object, 'blending', blending));
        }

        if (material.opacity !== undefined && Math.abs(material.opacity - opacity) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'opacity', opacity));
        }

        if (material.transparent !== undefined && material.transparent !== transparent) {
            editor.execute(new SetMaterialValueCommand(object, 'transparent', transparent));
        }

        if (material.alphaTest !== undefined && Math.abs(material.alphaTest - alphaTest) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'alphaTest', alphaTest));
        }

        if (material.wireframe !== undefined && material.wireframe !== wireframe) {
            editor.execute(new SetMaterialValueCommand(object, 'wireframe', wireframe));
        }

        if (material.wireframeLinewidth !== undefined && Math.abs(material.wireframeLinewidth - wireframeLinewidth) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(object, 'wireframeLinewidth', wireframeLinewidth));
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleTextureSetting() {
        if (!this.material.map) {
            app.toast(_t('Please select texture first.'), 'warn');
            return;
        }

        let win = app.createElement(TextureSettingWindow, {
            map: this.material.map
        });

        app.addElement(win);
    }

    editProgramInfo() {
        let material = this.material;

        let obj = {
            defines: material.defines,
            uniforms: material.uniforms,
            attributes: material.attributes
        };

        app.call(`editScript`, this, material.uuid, this.selected.name + '-ProgramInfo', 'json', JSON.stringify(obj), this.saveProgramInfo);
    }

    saveProgramInfo(uuid, name, type, source) {
        let material = this.material;

        try {
            let obj = JSON.parse(source);
            material.defines = obj.defines;
            material.uniforms = obj.uniforms;
            material.attributes = obj.attributes;
            material.needsUpdate = true;
        } catch (e) {
            app.error(this.selected.name + `-${_t('Shader cannot be parsed.')}`);
        }
    }

    editVertexShader() {
        let material = this.material;

        app.call(`editScript`, this, material.uuid, this.selected.name + '-VertexShader', 'vertexShader', material.vertexShader, this.saveVertexShader);
    }

    saveVertexShader(uuid, name, type, source) {
        let material = this.material;
        material.vertexShader = source;
        material.needsUpdate = true;
    }

    editFragmentShader() {
        let material = this.material;

        app.call(`editScript`, this, material.uuid, this.selected.name + '-FragmentShader', 'fragmentShader', material.fragmentShader, this.saveFragmentShader);
    }

    saveFragmentShader(uuid, name, type, source) {
        let material = this.material;
        material.fragmentShader = source;
        material.needsUpdate = true;
    }

    // --------------------------------------- 材质保存载入 --------------------------------------------------

    onSave() {
        app.prompt({
            title: _t('Please enter material name'),
            content: _t('Name'),
            value: _t('New Material'),
            onOK: value => {
                this.commitSave(value);
            }
        });
    }

    commitSave(name) {
        const material = this.material;
        const data = new MaterialsSerializer().toJSON(material);

        // 材质球图片
        const dataURL = MaterialUtils.createMaterialImage(material).toDataURL('image/png');

        const file = Converter.dataURLtoFile(dataURL, name);

        // 上传图片
        Ajax.post(`${app.options.server}/api/Upload/Upload`, {
            file: file
        }, result => {
            let obj = JSON.parse(result);

            if (obj.Code === 300) {
                app.toast(_t(obj.Msg));
                return;
            }

            Ajax.post(`${app.options.server}/api/Material/Save`, {
                Name: name,
                Data: JSON.stringify(data),
                Thumbnail: obj.Data.url
            }, result => {
                obj = JSON.parse(result);
                if (obj.Code === 200) {
                    // TODO: 保存材质时，没有刷新材质面板。
                    app.call(`showBottomPanel`, this, 'material');
                }
                app.toast(_t(obj.Msg));
            });
        });
    }

    onLoad() {
        app.call(`selectBottomPanel`, this, 'material');
        app.toast(_t('Please click material on material panel.'));
        app.on(`selectMaterial.MaterialComponent`, this.onWaitingForMaterial.bind(this));
    }

    onWaitingForMaterial(material) {
        app.on(`selectMaterial.MaterialComponent`, null);

        if (this.material) {
            this.material.dispose();
        }

        if (Array.isArray(this.selected.material)) {
            this.selected.material[this.materialIndex] = material;
        } else {
            this.selected.material = material;
        }

        app.call('objectChanged', this, this.selected);
    }
}

export default MaterialComponent;