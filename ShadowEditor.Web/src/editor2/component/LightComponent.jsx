import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, ColorProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 光源组件
 * @author tengge / https://github.com/tengge1
 */
class LightComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,

            showColor: false,
            color: '',

            showIntensity: false,
            intensity: 1.0,

            showDistance: false,
            distance: 1.0,

            showAngle: false,
            angle: 0.0,

            showPenumbra: false,
            penumbra: 1.0,

            showDecay: false,
            decay: 1.0,

            showSkyColor: false,
            skyColor: '',

            showGroundColor: false,
            groundColor: '',

            showWidth: false,
            width: 1.0,

            showHeight: false,
            height: 1.0,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.handleChangeIntensity = this.handleChangeIntensity.bind(this);
        this.handleChangeDistance = this.handleChangeDistance.bind(this);
        this.handleChangeAngle = this.handleChangeAngle.bind(this);
        this.handleChangePenumbra = this.handleChangePenumbra.bind(this);
        this.handleChangeDecay = this.handleChangeDecay.bind(this);
        this.handleChangeSkyColor = this.handleChangeSkyColor.bind(this);
        this.handleChangeGroundColor = this.handleChangeGroundColor.bind(this);
        this.handleChangeWidth = this.handleChangeWidth.bind(this);
        this.handleChangeHeight = this.handleChangeHeight.bind(this);
    }

    render() {
        const {
            show, expanded,
            showColor, color,
            showIntensity, intensity,
            showDistance, distance,
            showAngle, angle,
            showPenumbra, penumbra,
            showDecay, decay,
            showSkyColor, skyColor,
            showGroundColor, groundColor,
            showWidth, width,
            showHeight, height,
        } = this.state;

        return <PropertyGroup title={L_LIGHT_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ColorProperty label={L_COLOR} value={color} show={showColor} onChange={this.handleChangeColor}></ColorProperty>
            <NumberProperty label={L_INTENSITY} value={intensity} show={showIntensity} onChange={this.handleChangeIntensity}></NumberProperty>
            <NumberProperty label={L_DISTANCE} value={distance} show={showDistance} onChange={this.handleChangeDistance}></NumberProperty>
            <NumberProperty label={L_ANGLE} value={angle} show={showAngle} onChange={this.handleChangeAngle}></NumberProperty>
            <NumberProperty label={L_PENUMBRA} value={penumbra} show={showPenumbra} onChange={this.handleChangePenumbra}></NumberProperty>
            <NumberProperty label={L_DECAY} value={decay} show={showDecay} onChange={this.handleChangeDecay}></NumberProperty>
            <ColorProperty label={L_SKY_COLOR} value={skyColor} show={showSkyColor} onChange={this.handleChangeSkyColor}></ColorProperty>
            <ColorProperty label={L_GROUND_COLOR} value={groundColor} show={showGroundColor} onChange={this.handleChangeGroundColor}></ColorProperty>
            <NumberProperty label={L_WIDTH} value={width} show={showWidth} onChange={this.handleChangeWidth}></NumberProperty>
            <NumberProperty label={L_HEIGHT} value={height} show={showHeight} onChange={this.handleChangeHeight}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.LightComponent`, this.handleUpdate);
        app.on(`objectChanged.LightComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Light)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let state = this.state;

        state.show = true;

        if (this.selected instanceof THREE.HemisphereLight) {
            state.showColor = false;
        } else {
            state.showColor = true;
            state.color = `#${this.selected.color.getHexString()}`;
        }

        state.showIntensity = true;
        state.intensity = this.selected.intensity;

        if (this.selected instanceof THREE.PointLight || this.selected instanceof THREE.SpotLight) {
            state.showDistance = true;
            state.showDecay = true;
            state.distance = this.selected.distance;
            state.decay = this.selected.decay;
        } else {
            state.showDistance = false;
            state.showDecay = false;
        }

        if (this.selected instanceof THREE.SpotLight) {
            state.showAngle = true;
            state.showPenumbra = true;
            state.angle = this.selected.angle;
            state.penumbra = this.selected.penumbra;
        } else {
            state.showAngle = false;
            state.showPenumbra = false;
        }

        if (this.selected instanceof THREE.HemisphereLight) {
            state.showSkyColor = true;
            state.showGroundColor = true;
            state.skyColor = `#${this.selected.color.getHexString()}`;
            state.groundColor = `#${this.selected.groundColor.getHexString()}`;
        } else {
            state.showSkyColor = false;
            state.showGroundColor = false;
        }

        if (this.selected instanceof THREE.RectAreaLight) {
            state.showWidth = true;
            state.showHeight = true;
            state.width = this.selected.width;
            state.height = this.selected.height;
        } else {
            state.showWidth = false;
            state.showHeight = false;
        }

        this.setState({ state });
    }

    handleChangeColor() {
        var objectColor = UI.get('objectColor', this.id);
        this.selected.color = new THREE.Color(objectColor.getHexValue());
        var helper = this.selected.children.filter(n => n.userData.type === 'helper')[0];
        if (helper) {
            helper.material.color = this.selected.color;
        }
    }

    handleChangeIntensity() {
        var objectIntensity = UI.get('objectIntensity', this.id);
        this.selected.intensity = objectIntensity.getValue();
    }

    handleChangeDistance() {
        var objectDistance = UI.get('objectDistance', this.id);
        this.selected.distance = objectDistance.getValue();
    }

    handleChangeAngle() {
        var objectAngle = UI.get('objectAngle', this.id);
        this.selected.angle = objectAngle.getValue();
    }

    handleChangePenumbra() {
        var objectPenumbra = UI.get('objectPenumbra', this.id);
        this.selected.penumbra = objectPenumbra.getValue();
    }

    handleChangeDecay() {
        var objectDecay = UI.get('objectDecay', this.id);
        this.selected.decay = objectDecay.getValue();
    }

    handleChangeSkyColor() {
        var objectSkyColor = UI.get('objectSkyColor', this.id);
        this.selected.color = new THREE.Color(objectSkyColor.getHexValue());

        var sky = this.selected.children.filter(n => n.userData.type === 'sky')[0];
        if (sky) {
            sky.material.uniforms.topColor.value = this.selected.color;
        }
    }

    handleChangeGroundColor() {
        var objectGroundColor = UI.get('objectGroundColor', this.id);
        this.selected.groundColor = new THREE.Color(objectGroundColor.getHexValue());

        var sky = this.selected.children.filter(n => n.userData.type === 'sky')[0];
        if (sky) {
            sky.material.uniforms.bottomColor.value = this.selected.groundColor;
        }
    }

    handleChangeWidth() {
        var objectWidth = UI.get('objectWidth', this.id);
        this.selected.width = objectWidth.getValue();
    }

    handleChangeHeight() {
        var objectHeight = UI.get('objectHeight', this.id);
        this.selected.height = objectHeight.getValue();
    }
}

export default LightComponent;