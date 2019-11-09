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

import TextureSettingWindow from '../window/TextureSettingWindow.jsx';

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
            wireframeLinewidth: 1
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

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
        const { show, expanded } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Material Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <ButtonsProperty label={''}>
                <Button onClick={this.onSave}>{_t('Save')}</Button>
                <Button onClick={this.onLoad}>{_t('Select')}</Button>
            </ButtonsProperty>
            <SelectProperty label={_t('Type')}
                options={this.materials}
                name={'type'}
                value={type}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MaterialComponent`, this.handleUpdate);
        app.on(`objectChanged.MaterialComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.material instanceof THREE.Material)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let material = this.selected.material;

        let state = {
            show: true,
            type: material.type,
            showProgram: material instanceof THREE.ShaderMaterial || material instanceof THREE.RawShaderMaterial
        };

        this.setState(state);
    }

    handleChange(value, name) {
    }
}

export default MaterialComponent;