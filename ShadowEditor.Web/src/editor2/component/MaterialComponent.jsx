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

        this.updateMaterial = this.updateMaterial.bind(this);
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
            <SelectProperty label={L_TYPE} options={this.materials} name={'type'} value={type} onChange={this.updateMaterial}></SelectProperty>
            <ButtonsProperty label={L_SHADER_PROGRAM} show={showProgram}>
                <Button onClick={this.editProgramInfo}>{L_SHADER_PROGRAM}</Button>
                <Button onClick={this.editVertexShader}>{L_VERTEX}</Button>
                <Button onClick={this.editFragmentShader}>{L_FRAGMENT}</Button>
            </ButtonsProperty>
            <ColorProperty label={L_COLOR} name={'color'} value={color} show={showColor} onChange={this.updateMaterial}></ColorProperty>
            <NumberProperty label={L_ROUGHNESS} name={'roughness'} value={roughness} show={showRoughness} onChange={this.updateMaterial}></NumberProperty>
            <NumberProperty label={L_METALNESS} name={'metalness'} value={metalness} show={showMetalness} onChange={this.updateMaterial}></NumberProperty>
            <ColorProperty label={L_EMISSIVE} name={'emissive'} value={emissive} show={showEmissive} onChange={this.updateMaterial}></ColorProperty>
            <ColorProperty label={L_SPECULAR} name={'specular'} value={specular} show={showSpecular} onChange={this.updateMaterial}></ColorProperty>
            <NumberProperty label={L_SHININESS} name={'shininess'} value={shininess} show={showShininess} onChange={this.updateMaterial}></NumberProperty>
            <NumberProperty label={L_CLEAR_COAT} name={'clearCoat'} value={clearCoat} show={showClearCoat} onChange={this.updateMaterial}></NumberProperty>
            <NumberProperty label={L_CLEAR_COAT_ROUGHNESS} name={'clearCoatRoughness'} value={clearCoatRoughness} show={showClearCoatRoughness} onChange={this.updateMaterial}></NumberProperty>
            <SelectProperty label={L_VERTEX_COLOR} options={this.vertexColors} name={'vertexColors'} value={vertexColors} show={showVertexColors} onChange={this.updateMaterial}></SelectProperty>
            <CheckBoxProperty label={L_SKIN} name={'skinning'} value={skinning} show={showSkinning} onChange={this.updateMaterial}></CheckBoxProperty>
            <TextureProperty label={L_TEXTURE} name={'map'} value={map} onChange={this.updateMaterial}></TextureProperty>
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
        }

        if (material.roughness !== undefined) {
            state.showRoughness = true;
            state.roughness = material.roughness;
        }

        if (material.metalness !== undefined) {
            state.showMetalness = true;
            state.metalness = material.metalness;
        }

        if (material.emissive !== undefined) {
            state.showEmissive = true;
            state.emissive = `#${material.emissive.getHexString()}`;
        }

        if (material.specular !== undefined) {
            state.showSpecular = true;
            state.specular = `#${material.specular.getHexString()}`;
        }

        if (material.shininess !== undefined) {
            state.showShininess = true;
            state.shininess = material.shininess;
        }

        if (material.clearCoat !== undefined) {
            state.showClearCoat = true;
            state.clearCoat = material.clearCoat;
        }

        if (material.clearCoatRoughness !== undefined) {
            state.showClearCoatRoughness = true;
            state.clearCoatRoughness = material.clearCoatRoughness;
        }

        if (material.vertexColors !== undefined) {
            state.showVertexColors = true;
            state.vertexColors = material.vertexColors;
        }

        if (material.skinning !== undefined) {
            state.showSkinning = true;
            state.skinning = material.skinning;
        }

        if (material.map !== undefined) {
            state.showMap = true;
            state.mapEnabled = material.map !== null;

            if (state.mapEnabled) {
                state.map = material.map;
            }
        }

        if (material.alphaMap !== undefined) {
            state.showAlphaMap = true;
            state.alphaMapEnabled = material.alphaMap !== null;

            if (state.alphaMapEnabled) {
                state.alphaMap = material.alphaMap;
            }
        }

        if (material.bumpMap !== undefined) {
            state.showBumpMap = true;
            state.bumpMapEnabled = material.bumpMap !== null;

            if (state.bumpMapEnabled) {
                state.bumpMap = material.bumpMap;
                state.bumpScale = material.bumpScale;
            }
        }

        if (material.normalMap !== undefined) {
            state.showNormalMap = true;
            state.normalMapEnabled = material.normalMap !== null;

            if (state.normalMapEnabled) {
                state.normalMap = material.normalMap;
            }
        }

        if (material.displacementMap !== undefined) {
            state.showDisplacementMap = true;
            state.displacementMapEnabled = material.displacementMap !== null;

            if (state.displacementMapEnabled) {
                state.displacementMap = material.displacementMap;
                state.displacementScale = material.displacementScale;
            }
        }

        if (material.roughnessMap !== undefined) {
            state.showRoughnessMap = true;
            state.roughnessMapEnabled = material.roughnessMap !== null;

            if (state.roughnessMapEnabled) {
                state.roughnessMap = material.roughnessMap;
            }
        }

        if (material.metalnessMap !== undefined) {
            state.showMetalnessMap = true;
            state.metalnessMapEnabled = material.metalnessMap !== null;

            if (state.metalnessMapEnabled) {
                state.metalnessMap = material.metalnessMap;
            }
        }

        if (material.specularMap !== undefined) {
            state.showSpecularMap = true;
            state.specularMapEnabled = material.specularMap !== null;

            if (state.specularMapEnabled) {
                state.specularMap = material.specularMap;
            }
        }

        if (material.envMap !== undefined) {
            state.showEnvMap = true;
            state.envMapEnabled = material.envMap !== null;

            if (state.envMapEnabled) {
                state.envMap = material.envMap;
            }
        }

        if (material.reflectivity !== undefined) {
            state.reflectivity = material.reflectivity;
        }

        if (material.lightMap !== undefined) {
            state.showLightMap = true;
            state.lightMapEnabled = material.lightMap !== null;

            if (state.lightMapEnabled) {
                state.lightMap = material.lightMap;
            }
        }

        if (material.aoMap !== undefined) {
            state.showAoMap = true;
            state.aoMapEnabled = material.aoMap !== null;

            if (state.aoMapEnabled) {
                state.aoMap = material.aoMap;
                state.aoScale = material.aoMapIntensity;
            }
        }

        if (material.emissiveMap !== undefined) {
            state.showEmissiveMap = true;
            state.emissiveMapEnabled = material.emissiveMap !== null;

            if (state.emissiveMapEnabled) {
                state.emissiveMap = material.emissiveMap;
            }
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

    updateMaterial() {
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

        var editor = app.editor;
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

            editor.execute(new SetMaterialCommand(object, material), L_NEW_MATERIAL + ':' + type.getValue());
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
            console.warn(`${L_CANNOT_SET_TEXTURE} ${this.selected.name} ${L_MATERIAL_HAS_NO_COORDINATES}`);
        }
    }

    editProgramInfo() {
        var material = this.selected.material;

        var obj = {
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
        var material = this.selected.material;

        app.script.open(material.uuid, this.selected.name + '-VertexShader', 'vertexShader', material.vertexShader, this.selected.name + `-${L_VERTEX_SHADER}`, source => {
            material.vertexShader = source;
            material.needsUpdate = true;
        });
    }

    editFragmentShader() {
        var material = this.selected.material;

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