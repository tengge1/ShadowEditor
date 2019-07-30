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
            'PointCloudMaterial': L_POINT_CLOUD_MATERIAL,
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

        this.state = {
            show: false,
            expanded: true,

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
            mapEnabled: null,
            map: null,

            showAlphaMap: false,
            alphaMapEnabled: null,
            alphaMap: null,

            showBumpMap: false,
            bumpMapEnabled: null,
            bumpMap: null,
            bumpScale: null,

            showNormalMap: false,
            normalMapEnabled: null,
            normalMap: null,

            showDisplacementMap: false,
            displacementMapEnabled: null,
            displacementMap: null,
            displacementScale: null,

            showRoughnessMap: false,
            roughnessMapEnabled: null,
            roughnessMap: null,

            showMetalnessMap: false,
            metalnessMapEnabled: null,
            metalnessMap: null,

            showSpecularMap: false,
            specularMapEnabled: null,
            specularMap: null,

            showEnvMap: false,
            envMapEnabled: null,
            envMap: null,

            reflectivity: null,

            showLightMap: false,
            lightMapEnabled: null,
            lightMap: null,

            showAoMap: false,
            aoMapEnabled: null,
            aoMap: null,
            aoScale: null,

            showEmissiveMap: false,
            emissiveMapEnabled: null,
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
            showMap, mapEnabled, map, showAlphaMap, alphaMapEnabled, alphaMap, showBumpMap, bumpMapEnabled, bumpMap, bumpScale, showNormalMap, normalMapEnabled, normalMap, showDisplacementMap, displacementMapEnabled, displacementMap,
            displacementScale, showRoughnessMap, roughnessMapEnabled, roughnessMap, showMetalnessMap, metalnessMapEnabled, metalnessMap, showSpecularMap, specularMapEnabled, specularMap, showEnvMap, envMapEnabled, envMap,
            reflectivity, showLightMap, lightMapEnabled, lightMap, showAoMap, aoMapEnabled, aoMap, aoScale, showEmissiveMap, emissiveMapEnabled, emissiveMap, showSide, side, showFlatShading, flatShading, showBlending, blending, showOpacity, opacity,
            showTransparent, transparent, showAlphaTest, alphaTest, showWireframe, wireframe, wireframeLinewidth } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_MATERIAL_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ButtonsProperty label={''}>
                <Button onClick={this.onSave}>{L_SAVE}</Button>
                <Button onClick={this.onLoad}>{L_SELECT}</Button>
            </ButtonsProperty>
            <SelectProperty label={L_TYPE} options={this.materials} name={'type'} value={type} onChange={this.handleChange}></SelectProperty>
            <ButtonsProperty label={L_SHADER_PROGRAM} show={showProgram}>
                <Button onClick={this.editProgramInfo}>{L_SHADER_PROGRAM}</Button>
                <Button onClick={this.editVertexShader}>{L_VERTEX}</Button>
                <Button onClick={this.editFragmentShader}>{L_FRAGMENT}</Button>
            </ButtonsProperty>
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
            <TextureProperty label={L_TEXTURE} name={'map'} value={map} enabled={mapEnabled} show={showMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_ALPHA_MAP} name={'alphaMap'} value={alphaMap} enabled={alphaMapEnabled} show={showAlphaMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_BUMP_MAP} name={'bumpMap'} value={bumpMap} enabled={bumpMapEnabled} scale={bumpScale} show={showBumpMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_NORMAL_MAP} name={'normalMap'} value={normalMap} enabled={normalMapEnabled} show={showNormalMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_DISPLACEMENT_MAP} name={'displacementMap'} value={displacementMap} enabled={displacementMapEnabled} scale={displacementScale} show={showDisplacementMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_ROUGHNESS_MAP} name={'roughnessMap'} value={roughnessMap} enabled={roughnessMapEnabled} show={showRoughnessMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_METALNESS_MAP} name={'metalnessMap'} value={metalnessMap} enabled={metalnessMapEnabled} show={showMetalnessMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_SPECULAR_MAP} name={'specularMap'} value={specularMap} enabled={specularMapEnabled} show={showSpecularMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_ENV_MAP} name={'envMap'} value={envMap} enabled={envMapEnabled} show={showEnvMap} scale={reflectivity} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_LIGHT_MAP} name={'lightMap'} value={lightMap} enabled={lightMapEnabled} show={showLightMap} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_AO_MAP} name={'aoMap'} value={aoMap} enabled={aoMapEnabled} show={showAoMap} scale={aoScale} onChange={this.handleChange}></TextureProperty>
            <TextureProperty label={L_EMISSIVE_MAP} name={'emissiveMap'} value={emissiveMap} enabled={emissiveMapEnabled} show={showEmissiveMap} onChange={this.handleChange}></TextureProperty>
            <SelectProperty label={L_SIDE} options={this.side} name={'side'} value={side} onChange={this.handleChange}></SelectProperty>
            <CheckBoxProperty label={L_FLAT_SHADING} name={'flatShading'} value={flatShading} onChange={this.handleChange}></CheckBoxProperty>
            <SelectProperty label={L_BLENDING} options={this.blending} name={'blending'} value={blending} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={L_OPACITY} name={'opacity'} value={opacity} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_TRANSPARENT} name={'transparent'} value={transparent} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_ALPHA_TEST} name={'alphaTest'} value={alphaTest} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_WIREFRAME} name={'wireframe'} value={wireframe} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_WIREFRAME} name={'wireframeLinewidth'} value={wireframeLinewidth} onChange={this.handleChange}></NumberProperty>
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
            state.mapEnabled = material.map !== null;

            if (state.mapEnabled) {
                state.map = material.map;
            }
        } else {
            state.showMap = false;
        }

        if (material.alphaMap !== undefined) {
            state.showAlphaMap = true;
            state.alphaMapEnabled = material.alphaMap !== null;

            if (state.alphaMapEnabled) {
                state.alphaMap = material.alphaMap;
            }
        } else {
            state.showAlphaMap = false;
        }

        if (material.bumpMap !== undefined) {
            state.showBumpMap = true;
            state.bumpMapEnabled = material.bumpMap !== null;

            if (state.bumpMapEnabled) {
                state.bumpMap = material.bumpMap;
                state.bumpScale = material.bumpScale;
            }
        } else {
            state.showBumpMap = false;
        }

        if (material.normalMap !== undefined) {
            state.showNormalMap = true;
            state.normalMapEnabled = material.normalMap !== null;

            if (state.normalMapEnabled) {
                state.normalMap = material.normalMap;
            }
        } else {
            state.showNormalMap = false;
        }

        if (material.displacementMap !== undefined) {
            state.showDisplacementMap = true;
            state.displacementMapEnabled = material.displacementMap !== null;

            if (state.displacementMapEnabled) {
                state.displacementMap = material.displacementMap;
                state.displacementScale = material.displacementScale;
            }
        } else {
            state.showDisplacementMap = false;
        }

        if (material.roughnessMap !== undefined) {
            state.showRoughnessMap = true;
            state.roughnessMapEnabled = material.roughnessMap !== null;

            if (state.roughnessMapEnabled) {
                state.roughnessMap = material.roughnessMap;
            }
        } else {
            state.showRoughnessMap = false;
        }

        if (material.metalnessMap !== undefined) {
            state.showMetalnessMap = true;
            state.metalnessMapEnabled = material.metalnessMap !== null;

            if (state.metalnessMapEnabled) {
                state.metalnessMap = material.metalnessMap;
            }
        } else {
            state.showMetalnessMap = false;
        }

        if (material.specularMap !== undefined) {
            state.showSpecularMap = true;
            state.specularMapEnabled = material.specularMap !== null;

            if (state.specularMapEnabled) {
                state.specularMap = material.specularMap;
            }
        } else {
            state.showSpecularMap = false;
        }

        if (material.envMap !== undefined) {
            state.showEnvMap = true;
            state.envMapEnabled = material.envMap !== null;

            if (state.envMapEnabled) {
                state.envMap = material.envMap;
            }

            if (material.reflectivity !== undefined) {
                state.reflectivity = material.reflectivity;
            }
        } else {
            state.showEnvMap = false;
        }

        if (material.lightMap !== undefined) {
            state.showLightMap = true;
            state.lightMapEnabled = material.lightMap !== null;

            if (state.lightMapEnabled) {
                state.lightMap = material.lightMap;
            }
        } else {
            state.showLightMap = false;
        }

        if (material.aoMap !== undefined) {
            state.showAoMap = true;
            state.aoMapEnabled = material.aoMap !== null;

            if (state.aoMapEnabled) {
                state.aoMap = material.aoMap;
                state.aoScale = material.aoMapIntensity;
            }
        } else {
            state.showAoMap = false;
        }

        if (material.emissiveMap !== undefined) {
            state.showEmissiveMap = true;
            state.emissiveMapEnabled = material.emissiveMap !== null;

            if (state.emissiveMapEnabled) {
                state.emissiveMap = material.emissiveMap;
            }
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
        this.setState({
            [name]: value,
        });

        if (value === null) {
            return;
        }

        let editor = app.editor;
        let object = this.selected;
        let geometry = object.geometry;
        let material = object.material;

        const { type, showProgram, showColor, color, showRoughness, roughness, showMetalness, metalness, showEmissive, emissive, showSpecular, specular, showShininess, shininess, showClearCoat, clearCoat, showClearCoatRoughness, clearCoatRoughness, showVertexColors, vertexColors, showSkinning, skinning,
            showMap, mapEnabled, map, showAlphaMap, alphaMapEnabled, alphaMap, showBumpMap, bumpMapEnabled, bumpMap, bumpScale, showNormalMap, normalMapEnabled, normalMap, showDisplacementMap, displacementMapEnabled, displacementMap,
            displacementScale, showRoughnessMap, roughnessMapEnabled, roughnessMap, showMetalnessMap, metalnessMapEnabled, metalnessMap, showSpecularMap, specularMapEnabled, specularMap, showEnvMap, envMapEnabled, envMap,
            reflectivity, showLightMap, lightMapEnabled, lightMap, showAoMap, aoMapEnabled, aoMap, aoScale, showEmissiveMap, emissiveMapEnabled, emissiveMap, showSide, side, showFlatShading, flatShading, showBlending, blending, showOpacity, opacity,
            showTransparent, transparent, showAlphaTest, alphaTest, showWireframe, wireframe, wireframeLinewidth } = Object.assign({}, this.state, {
                [name]: value,
            });

        let textureWarning = false;
        let objectHasUvs = false;

        if (object instanceof THREE.Sprite) {
            objectHasUvs = true;
        }

        if (geometry instanceof THREE.Geometry && geometry.faceVertexUvs[0].length > 0) {
            objectHasUvs = true;
        }

        if (geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) {
            objectHasUvs = true;
        }

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

        if (material.map !== undefined) {
            if (objectHasUvs) {
                let map1 = mapEnabled ? map : null;
                if (mapEnabled && material.map !== map1) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', map1));
                }
            } else {
                if (mapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.alphaMap !== undefined) {
            if (objectHasUvs) {
                let alphaMap1 = alphaMapEnabled ? alphaMap : null;

                if (alphaMapEnabled && material.alphaMap !== alphaMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'alphaMap', alphaMap1));
                }
            } else {
                if (alphaMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.bumpMap !== undefined) {
            if (objectHasUvs) {
                let bumpMap1 = bumpMapEnabled ? bumpMap : null;

                if (bumpMapEnabled && material.bumpMap !== bumpMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'bumpMap', bumpMap1));
                }

                if (bumpMapEnabled && material.bumpScale !== bumpScale) {
                    editor.execute(new SetMaterialValueCommand(object, 'bumpScale', bumpScale));
                }
            } else {
                if (bumpMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.normalMap !== undefined) {
            if (objectHasUvs) {
                let normalMap1 = normalMapEnabled ? normalMap : null;

                if (normalMapEnabled && material.normalMap !== normalMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'normalMap', normalMap1));
                }
            } else {
                if (normalMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.displacementMap !== undefined) {
            if (objectHasUvs) {
                let displacementMap1 = displacementMapEnabled ? displacementMap : null;

                if (displacementMapEnabled && material.displacementMap !== displacementMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'displacementMap', displacementMap1));
                }

                if (displacementMapEnabled && material.displacementScale !== displacementScale) {
                    editor.execute(new SetMaterialValueCommand(object, 'displacementScale', displacementScale));
                }
            } else {
                if (displacementMapEnabled) {
                    textureWarning = true;
                }
            }

        }

        if (material.roughnessMap !== undefined) {
            if (objectHasUvs) {
                let roughnessMap1 = roughnessMapEnabled ? roughnessMap : null;

                if (roughnessMapEnabled && material.roughnessMap !== roughnessMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'roughnessMap', roughnessMap1));
                }
            } else {
                if (roughnessMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.metalnessMap !== undefined) {
            if (objectHasUvs) {
                let metalnessMap1 = metalnessMapEnabled ? metalnessMap : null;

                if (metalnessMapEnabled && material.metalnessMap !== metalnessMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'metalnessMap', metalnessMap1));
                }
            } else {
                if (metalnessMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.specularMap !== undefined) {
            if (objectHasUvs) {
                let specularMap1 = specularMapEnabled ? specularMap : null;

                if (specularMapEnabled && material.specularMap !== specularMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'specularMap', specularMap1));
                }
            } else {
                if (specularMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.envMap !== undefined) {
            let envMap1 = envMapEnabled ? envMap : null;

            if (envMapEnabled && material.envMap !== envMap1) {
                editor.execute(new SetMaterialMapCommand(object, 'envMap', envMap1));
            }
        }

        if (material.reflectivity !== undefined) {
            if (material.reflectivity !== reflectivity) {
                editor.execute(new SetMaterialValueCommand(object, 'reflectivity', reflectivity));
            }
        }

        if (material.lightMap !== undefined) {
            if (objectHasUvs) {
                let lightMap1 = lightMapEnabled ? lightMap : null;

                if (lightMapEnabled && material.lightMap !== lightMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'lightMap', lightMap1));
                }
            } else {
                if (lightMapEnabled) {
                    textureWarning = true;
                }
            }
        }

        if (material.aoMap !== undefined) {
            if (objectHasUvs) {
                let aoMap1 = aoMapEnabled ? aoMap : null;

                if (aoMapEnabled && material.aoMap !== aoMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'aoMap', aoMap1));
                }

                if (aoMapEnabled && material.aoMapIntensity !== aoScale) {
                    editor.execute(new SetMaterialValueCommand(object, 'aoMapIntensity', aoScale));
                }
            } else {
                if (aoMapEnabled) textureWarning = true;
            }
        }

        if (material.emissiveMap !== undefined) {
            if (objectHasUvs) {
                var emissiveMap1 = emissiveMapEnabled ? emissiveMap : null;

                if (emissiveMapEnabled && material.emissiveMap !== emissiveMap1) {
                    editor.execute(new SetMaterialMapCommand(object, 'emissiveMap', emissiveMap1));
                }
            } else {
                if (emissiveMapEnabled) {
                    textureWarning = true;
                }
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

        if (textureWarning) {
            console.warn(`${L_CANNOT_SET_TEXTURE} ${this.selected.name} ${L_MATERIAL_HAS_NO_COORDINATES}`);
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
        UI.prompt(L_ENTER_MATERIAL_NAME, L_NAME, L_NEW_MATERIAL, (event, value) => {
            this.commitSave(value);
        });
    }

    commitSave(name) {
        var material = this.selected.material;
        var data = (new MaterialsSerializer()).toJSON(material);

        // 材质球图片
        var dataURL = MaterialUtils.createMaterialImage(material).toDataURL('image/png');

        var file = Converter.dataURLtoFile(dataURL, name);

        // 上传图片
        Ajax.post(`${app.options.server}/api/Upload/Upload`, {
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
                    app.call(`showBottomPanel`, this, 'material');
                }
                app.toast(obj.Msg);
            });
        });
    }

    onLoad() {
        app.call(`selectBottomPanel`, this, 'material');
        app.toast(L_CLICK_MATERIAL_ON_PANEL);
        app.on(`selectMaterial.${this.id}`, this.onWaitingForMaterial.bind(this));
    }

    onWaitingForMaterial(material) {
        app.on(`selectMaterial.${this.id}`, null);

        if (this.selected.material) {
            this.selected.material.dispose();
        }

        this.selected.material = material;

        app.call('objectChanged', this, this.selected);
    }
}

export default MaterialComponent;