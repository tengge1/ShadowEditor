import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, SelectProperty, ButtonsProperty, Button, ColorProperty, NumberProperty, TextureProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import SetMaterialCommand from '../../command/SetMaterialCommand';
import SetMaterialColorCommand from '../../command/SetMaterialColorCommand';
import SetMaterialValueCommand from '../../command/SetMaterialValueCommand';
import SetMaterialMapCommand from '../../command/SetMaterialMapCommand';
import ShaderMaterialVertex from './shader/shader_material_vertex.glsl';
import ShaderMaterialFragment from './shader/shader_material_fragment.glsl';
import RawShaderMaterialVertex from './shader/raw_shader_material_vertex.glsl';
import RawShaderMaterialFragment from './shader/raw_shader_material_fragment.glsl';

// import TextureSelectControl from '../editor/control/TextureSelectControl';
// import TextureSettingWindow from '../editor/window/TextureSettingWindow';

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

        this.materials = {
            'LineBasicMaterial': L_LINE_BASIC_MATERIAL,
            'LineDashedMaterial': L_LINE_DASHED_MATERIAL,
            'MeshBasicMaterial': L_MESH_BASIC_MATERIAL,
            'MeshDepthMaterial': L_MESH_DEPTH_MATERIAL,
            'MeshNormalMaterial': L_MESH_NORMAL_MATERIAL,
            'MeshLambertMaterial': L_MESH_LAMBERT_MATERIAL,
            'MeshPhongMaterial': L_MESH_PHONG_MATERIAL,
            'PointsMaterial': L_POINT_CLOUD_MATERIAL,
            'MeshStandardMaterial': L_MESH_STANDARD_MATERIAL,
            'MeshPhysicalMaterial': L_MESH_PHYSICAL_MATERIAL,
            'SpriteMaterial': L_SPRITE_MATERIAL,
            'ShaderMaterial': L_SHADER_MATERIAL,
            'RawShaderMaterial': L_RAW_SHADER_MATERIAL
        };

        this.vertexColors = {
            0: L_NO_COLORS,
            1: L_FACE_COLORS,
            2: L_VERTEX_COLORS,
        };

        this.side = {
            0: L_FRONT_SIDE,
            1: L_BACK_SIDE,
            2: L_DOUBLE_SIDE,
        };

        this.blending = {
            0: L_NO_BLENDING,
            1: L_NORMAL_BLENDING,
            2: L_ADDITIVE_BLENDING,
            3: L_SUBSTRACTIVE_BLENDING,
            4: L_MULTIPLY_BLENDING,
            5: L_CUSTOM_BLENDING,
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
            'emissiveMap',
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

            reflectivity: null,

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
            wireframeLinewidth: 1,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);

        this.editProgramInfo = this.editProgramInfo.bind(this);
        this.editVertexShader = this.editVertexShader.bind(this);
        this.editFragmentShader = this.editFragmentShader.bind(this);

        this.onSetMap = this.onSetMap.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    render() {
        const { show, expanded, type, showProgram, showColor, color, showRoughness, roughness, showMetalness, metalness, showEmissive, emissive, showSpecular, specular, showShininess, shininess, showClearCoat, clearCoat, showClearCoatRoughness, clearCoatRoughness, showVertexColors, vertexColors, showSkinning, skinning,
            showMap, map, showAlphaMap, alphaMap, showBumpMap, bumpMap, bumpScale, showNormalMap, normalMap, showDisplacementMap, displacementMap,
            displacementScale, showRoughnessMap, roughnessMap, showMetalnessMap, metalnessMap, showSpecularMap, specularMap, showEnvMap, envMap,
            reflectivity, showLightMap, lightMap, showAoMap, aoMap, aoScale, showEmissiveMap, emissiveMap, showSide, side, showFlatShading, flatShading, showBlending, blending, showOpacity, opacity, showTransparent, transparent, showAlphaTest, alphaTest, showWireframe, wireframe, wireframeLinewidth } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_MATERIAL_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ButtonsProperty label={''}>
                <Button onClick={this.onSave}>{L_SAVE}</Button>
                <Button onClick={this.onLoad}>{L_SELECT}</Button>
            </ButtonsProperty>
            <SelectProperty label={L_TYPE} options={this.materials} name={'type'} value={type} onChange={this.handleChange}></SelectProperty>
            <ButtonProperty label={'Shader Info'} text={L_EDIT} show={showProgram} onChange={this.editProgramInfo}></ButtonProperty>
            <ButtonProperty label={'Vertex Shader'} text={L_EDIT} show={showProgram} onChange={this.editVertexShader}></ButtonProperty>
            <ButtonProperty label={'Frag Shader'} text={L_EDIT} show={showProgram} onChange={this.editFragmentShader}></ButtonProperty>
            <ColorProperty label={L_COLOR} name={'color'} value={color} show={showColor} onChange={this.handleChange}></ColorProperty>
            <NumberProperty label={L_ROUGHNESS} name={'roughness'} value={roughness} show={showRoughness} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_METALNESS} name={'metalness'} value={metalness} show={showMetalness} onChange={this.handleChange}></NumberProperty>
            <ColorProperty label={L_EMISSIVE} name={'emissive'} value={emissive} show={showEmissive} onChange={this.handleChange}></ColorProperty>
            <ColorProperty label={L_SPECULAR} name={'specular'} value={specular} show={showSpecular} onChange={this.handleChange}></ColorProperty>
            <NumberProperty label={L_SHININESS} name={'shininess'} value={shininess} show={showShininess} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CLEAR_COAT} name={'clearCoat'} value={clearCoat} show={showClearCoat} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CLEAR_COAT_ROUGHNESS} name={'clearCoatRoughness'} value={clearCoatRoughness} show={showClearCoatRoughness} onChange={this.handleChange}></NumberProperty>
            <SelectProperty label={L_VERTEX_COLOR} options={this.vertexColors} name={'vertexColors'} value={vertexColors} show={showVertexColors} onChange={this.handleChange}></SelectProperty>
            <CheckBoxProperty label={L_SKIN} name={'skinning'} value={skinning} show={showSkinning} onChange={this.handleChange}></CheckBoxProperty>
            <TextureProperty label={L_TEXTURE} name={'map'} value={map} show={showMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_ALPHA_MAP} name={'alphaMap'} value={alphaMap} show={showAlphaMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_BUMP_MAP} name={'bumpMap'} value={bumpMap} show={showBumpMap} onChange={this.handleChange}></TextureProperty>
            <NumberProperty label={'Bump Scale'} name={'bumpScale'} value={bumpScale} onChange={this.handleChange}></NumberProperty>
            <TextureProperty label={L_NORMAL_MAP} name={'normalMap'} value={normalMap} show={showNormalMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_DISPLACEMENT_MAP} name={'displacementMap'} value={displacementMap} show={showDisplacementMap} onChange={this.handleChange}></TextureProperty>
            <NumberProperty label={'Displace Scale'} name={'displacementScale'} value={displacementScale} onChange={this.handleChange}></NumberProperty>
            <TextureProperty label={L_ROUGHNESS_MAP} name={'roughnessMap'} value={roughnessMap} show={showRoughnessMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_METALNESS_MAP} name={'metalnessMap'} value={metalnessMap} show={showMetalnessMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_SPECULAR_MAP} name={'specularMap'} value={specularMap} show={showSpecularMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_ENV_MAP} name={'envMap'} value={envMap} show={showEnvMap} onChange={this.handleChange}></TextureProperty>
            <NumberProperty label={'Reflectivity'} name={'reflectivity'} value={reflectivity} onChange={this.handleChange}></NumberProperty>
            <TextureProperty label={L_LIGHT_MAP} name={'lightMap'} value={lightMap} show={showLightMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_AO_MAP} name={'aoMap'} value={aoMap} show={showAoMap} onChange={this.handleChange}></TextureProperty>
            <NumberProperty label={'Ao Scale'} name={'aoScale'} value={aoScale} onChange={this.handleChange}></NumberProperty>
            <TextureProperty label={L_EMISSIVE_MAP} name={'emissiveMap'} value={emissiveMap} show={showEmissiveMap} onChange={this.handleChange}></TextureProperty>
            <SelectProperty label={L_SIDE} options={this.side} name={'side'} value={side} onChange={this.handleChange}></SelectProperty>
            <CheckBoxProperty label={L_FLAT_SHADING} name={'flatShading'} value={flatShading} onChange={this.handleChange}></CheckBoxProperty>
            <SelectProperty label={L_BLENDING} options={this.blending} name={'blending'} value={blending} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={L_OPACITY} name={'opacity'} value={opacity} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_TRANSPARENT} name={'transparent'} value={transparent} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_ALPHA_TEST} name={'alphaTest'} value={alphaTest} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_WIREFRAME} name={'wireframe'} value={wireframe} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_WIREFRAME_WIDTH} name={'wireframeLinewidth'} value={wireframeLinewidth} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MaterialComponent`, this.handleUpdate);
        app.on(`objectChanged.MaterialComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.material instanceof THREE.Material)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let material = this.selected.material;

        let state = {
            show: true,
            type: material.type,
            showProgram: material instanceof THREE.ShaderMaterial || material instanceof THREE.RawShaderMaterial,
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

            if (material.reflectivity !== undefined) {
                state.reflectivity = material.reflectivity;
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
                [name]: value,
            });
            return;
        }

        const editor = app.editor;
        const object = this.selected;
        let material = object.material;

        const { type, showProgram, showColor, color, showRoughness, roughness, showMetalness, metalness, showEmissive, emissive, showSpecular, specular, showShininess, shininess, showClearCoat, clearCoat, showClearCoatRoughness, clearCoatRoughness, showVertexColors, vertexColors, showSkinning, skinning,
            showMap, map, showAlphaMap, alphaMap, showBumpMap, bumpMap, bumpScale, showNormalMap, normalMap, showDisplacementMap, displacementMap,
            displacementScale, showRoughnessMap, roughnessMap, showMetalnessMap, metalnessMap, showSpecularMap, specularMap, showEnvMap, envMap,
            reflectivity, showLightMap, lightMap, showAoMap, aoMap, aoScale, showEmissiveMap, emissiveMap, showSide, side, showFlatShading, flatShading, showBlending, blending, showOpacity, opacity, showTransparent, transparent, showAlphaTest, alphaTest, showWireframe, wireframe, wireframeLinewidth } = Object.assign({}, this.state, {
                [name]: value,
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

            editor.execute(new SetMaterialCommand(object, material), L_NEW_MATERIAL + ':' + type);
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

        if (material.specular !== undefined && `#${material.specular.getHexString()}` !== specular) {
            editor.execute(new SetMaterialColorCommand(object, 'specular', specular));
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
            } else {

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

        if (name === 'reflectivity' && material.reflectivity !== undefined) {
            editor.execute(new SetMaterialValueCommand(object, 'reflectivity', reflectivity));
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

        if (material.flatShading !== undefined && material.flatShading != flatShading) {
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

    editProgramInfo() {
        let material = this.selected.material;

        let obj = {
            defines: material.defines,
            uniforms: material.uniforms,
            attributes: material.attributes
        };

        app.script.open(material.uuid, this.selected.name + '-ProgramInfo', 'json', JSON.stringify(obj), this.selected.name + `-${L_SHADER_INFO}`, source => {
            try {
                obj = JSON.parse(source);
                material.defines = obj.defines;
                material.uniforms = obj.uniforms;
                material.attributes = obj.attributes;
                material.needsUpdate = true;
            } catch (e) {
                app.error(this.selected.name + `-${L_SHADER_CANNOT_PARSE}`);
            }
        });
    }

    editVertexShader() {
        let material = this.selected.material;

        app.script.open(material.uuid, this.selected.name + '-VertexShader', 'vertexShader', material.vertexShader, this.selected.name + `-${L_VERTEX_SHADER}`, source => {
            material.vertexShader = source;
            material.needsUpdate = true;
        });
    }

    editFragmentShader() {
        let material = this.selected.material;

        app.script.open(material.uuid, this.selected.name + '-FragmentShader', 'fragmentShader', material.fragmentShader, this.selected.name + `-${L_FRAGMENT_SHADER}`, source => {
            material.fragmentShader = source;
            material.needsUpdate = true;
        });
    }

    onSetMap() {
        if (this.mapSettingWindow === undefined) {
            this.mapSettingWindow = new TextureSettingWindow({
                app: app
            });
            this.mapSettingWindow.render();
        }

        if (!this.selected.material.map) {
            app.toast(L_SELECT_TEXTURE_FIRST);
            return;
        }

        this.mapSettingWindow.setData(this.selected.material.map);
        this.mapSettingWindow.show();
    }

    // --------------------------------------- 材质保存载入 --------------------------------------------------

    onSave() {
        app.prompt({
            title: L_ENTER_MATERIAL_NAME,
            content: L_NAME,
            value: L_NEW_MATERIAL,
            onOK: value => {
                this.commitSave(value);
            }
        });
    }

    commitSave(name) {
        const material = this.selected.material;
        const data = (new MaterialsSerializer()).toJSON(material);

        // 材质球图片
        const dataURL = MaterialUtils.createMaterialImage(material).toDataURL('image/png');

        const file = Converter.dataURLtoFile(dataURL, name);

        // 上传图片
        Ajax.post(`${app.options.server}/api/Upload/Upload`, {
            file: file
        }, result => {
            let obj = JSON.parse(result);

            if (obj.Code === 300) {
                app.toast(obj.Msg);
                return;
            }

            Ajax.post(`${app.options.server}/api/Material/Save`, {
                Name: name,
                Data: JSON.stringify(data),
                Thumbnail: obj.Data.url
            }, result => {
                obj = JSON.parse(result);
                if (obj.Code === 200) {
                    app.call(`showBottomPanel`, this, 'material');
                }
                app.toast(obj.Msg);
            });
        });
    }

    onLoad() {
        app.call(`selectBottomPanel`, this, 'material');
        app.toast(L_CLICK_MATERIAL_ON_PANEL);
        app.on(`selectMaterial.MaterialComponent`, this.onWaitingForMaterial.bind(this));
    }

    onWaitingForMaterial(material) {
        app.on(`selectMaterial.MaterialComponent`, null);

        if (this.selected.material) {
            this.selected.material.dispose();
        }

        this.selected.material = material;

        app.call('objectChanged', this, this.selected);
    }
}

export default MaterialComponent;