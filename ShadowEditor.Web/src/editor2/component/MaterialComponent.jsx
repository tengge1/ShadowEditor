import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, SelectProperty, ButtonsProperty, Button, ColorProperty } from '../../third_party';
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
            color: null,
            roughness: null,
            metalness: null,
            emissive: null,
            specular: null,
            shininess: null,
            clearCoat: null,
            clearCoatRoughness: null,
            vertexColors: null,
            skinning: null,
            mapEnabled: null,
            map: null,
            alphaMapEnabled: null,
            alphaMap: null,
            bumpMapEnabled: null,
            bumpMap: null,
            bumpScale: null,
            normalMapEnabled: null,
            normalMap: null,
            displacementMapEnabled: null,
            displacementMap: null,
            displacementScale: null,
            roughnessMapEnabled: null,
            roughnessMap: null,
            metalnessMapEnabled: null,
            metalnessMap: null,
            specularMapEnabled: null,
            specularMap: null,
            envMapEnabled: null,
            envMap: null,
            reflectivity: null,
            lightMapEnabled: null,
            lightMap: null,
            aoMapEnabled: null,
            aoMap: null,
            aoScale: null,
            emissiveMapEnabled: null,
            emissiveMap: null,
            side: null,
            flatShading: null,
            blending: null,
            opacity: 1,
            transparent: false,
            alphaTest: 1,
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
        const { show, expanded, type, color, roughness, metalness, emissive, specular, shininess, clearCoat, clearCoatRoughness, vertexColors, skinning,
            mapEnabled, map, alphaMapEnabled, alphaMap, bumpMapEnabled, bumpMap, bumpScale, normalMapEnabled, normalMap, displacementMapEnabled, displacementMap,
            displacementScale, roughnessMapEnabled, roughnessMap, metalnessMapEnabled, metalnessMap, specularMapEnabled, specularMap, envMapEnabled, envMap,
            reflectivity, lightMapEnabled, lightMap, aoMapEnabled, aoMap, aoScale, emissiveMapEnabled, emissiveMap, side, flatShading, blending, opacity,
            transparent, alphaTest, wireframe, wireframeLinewidth } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_MATERIAL_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ButtonsProperty label={''}>
                <Button onClick={this.onSave}>{L_SAVE}</Button>
                <Button onClick={this.onLoad}>{L_SELECT}</Button>
            </ButtonsProperty>
            <SelectProperty label={L_TYPE} options={this.materials} name={'type'} value={type} onChange={this.updateMaterial}></SelectProperty>
            <ButtonsProperty label={L_SHADER_PROGRAM}>
                <Button onClick={this.editProgramInfo}>{L_SHADER_PROGRAM}</Button>
                <Button onClick={this.editVertexShader}>{L_VERTEX}</Button>
                <Button onClick={this.editFragmentShader}>{L_FRAGMENT}</Button>
            </ButtonsProperty>
            <ColorProperty label={L_COLOR} name={'color'} value={color} onChange={this.updateMaterial}></ColorProperty>
            <NumberProperty label={L_ROUGHNESS} name={'roughness'} value={roughness} onChange={this.updateMaterial}></NumberProperty>
            <NumberProperty label={L_METALNESS} name={'metalness'} value={metalness} onChange={this.updateMaterial}></NumberProperty>
            <ColorProperty label={L_EMISSIVE} name={'emissive'} value={emissive} onChange={this.updateMaterial}></ColorProperty>
            <ColorProperty label={L_SPECULAR} name={'specular'} value={specular} onChange={this.updateMaterial}></ColorProperty>
            <NumberProperty label={L_SHININESS} name={'shininess'} value={shininess} onChange={this.updateMaterial}></NumberProperty>
            <NumberProperty label={L_CLEAR_COAT} name={'clearCoat'} value={clearCoat} onChange={this.updateMaterial}></NumberProperty>
            <NumberProperty label={L_CLEAR_COAT_ROUGHNESS} name={'clearCoatRoughness'} value={clearCoatRoughness} onChange={this.updateMaterial}></NumberProperty>
            <SelectProperty label={L_VERTEX_COLOR} options={this.vertexColors} name={'vertexColors'} value={vertexColors} onChange={this.updateMaterial}></SelectProperty>
            <CheckBoxProperty label={L_SKIN} name={'skinning'} value={skinning} onChange={this.updateMaterial}></CheckBoxProperty>
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

        const model = this.selected.userData.model;
        const animNames = model.getAnimations();

        let options = {

        };

        this.setRowVisibility();
        this.setRowValue();

        this.setState({
            show: true,
            options,
            animation: animNames[0],
            previewText: this.isPlaying ? L_CANCEL : L_PREVIEW,
        });
    }

    setRowVisibility() {
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
    }

    setRowValue() {
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