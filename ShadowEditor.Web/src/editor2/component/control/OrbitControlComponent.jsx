import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../third_party';

/**
 * 轨道控制器组件
 * @author tengge / https://github.com/tengge1
 */
class OrbitControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            minDistance: 0.0,
            maxDistance: 100000,
            minPolarAngle: 0,
            maxPolarAngle: 3.14,
            minAzimuthAngle: -100,
            maxAzimuthAngle: 100,
            enableDamping: false,
            dampingFactor: 0.25,
            enableZoom: true,
            zoomSpeed: 1.0,
            enableRotate: true,
            rotateSpeed: 1.0,
            enablePan: true,
            panSpeed: 1.0,
            screenSpacePanning: false,
            keyPanSpeed: 7.0,
            autoRotate: false,
            autoRotateSpeed: 2.0,
            enableKeys: true,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, minDistance, maxDistance, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, enableDamping, dampingFactor,
            enableZoom, zoomSpeed, enableRotate, rotateSpeed, enablePan, panSpeed, screenSpacePanning, keyPanSpeed, autoRotate, autoRotateSpeed,
            enableKeys } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_ORBIT_CONTROLS} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={L_MIN_DISTANCE} name={'minDistance'} value={minDistance} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_MAX_DISTANCE} name={'maxDistance'} value={maxDistance} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_MIN_POLAR_ANGLE} name={'minPolarAngle'} value={minPolarAngle} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_MAX_POLAR_ANGLE} name={'maxPolarAngle'} value={maxPolarAngle} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_MIN_AZIMUTH_ANGLE} name={'minAzimuthAngle'} value={minAzimuthAngle} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_MAX_AZIMUTH_ANGLE} name={'maxAzimuthAngle'} value={maxAzimuthAngle} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_ENABLE_DAMPING} name={'enableDamping'} value={enableDamping} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_DAMPING_FACTOR} name={'dampingFactor'} value={dampingFactor} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_ENABLE_ZOOM} name={'enableZoom'} value={enableZoom} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_ZOOM_SPEED} name={'zoomSpeed'} value={zoomSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_ENABLE_ROTATE} name={'enableRotate'} value={enableRotate} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_ROTATE_SPEED} name={'rotateSpeed'} value={rotateSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_PAN_SPEED} name={'enablePan'} value={enablePan} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_PAN_SPEED} name={'panSpeed'} value={panSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_SCREEN_SPACE_PANNING} name={'screenSpacePanning'} value={screenSpacePanning} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_KEY_PAN_SPEED} name={'keyPanSpeed'} value={keyPanSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_AUTO_ROTATE} name={'autoRotate'} value={autoRotate} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_AUTO_ROTATE_SPEED} name={'autoRotateSpeed'} value={autoRotateSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_ENABLE_KEYS} name={'enableKeys'} value={enableKeys} onChange={this.handleChange}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.OrbitControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.OrbitControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'OrbitControls') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected.userData.orbitOptions === undefined) {
            this.selected.userData.orbitOptions = {
                minDistance: 0,
                maxDistance: 99999,
                minPolarAngle: 0,
                maxPolarAngle: Math.PI,
                minAzimuthAngle: - 9999,
                maxAzimuthAngle: 9999,
                enableDamping: false,
                dampingFactor: 0.25,
                enableZoom: true,
                zoomSpeed: 1.0,
                enableRotate: true,
                rotateSpeed: 1.0,
                enablePan: true,
                panSpeed: 1.0,
                screenSpacePanning: false,
                keyPanSpeed: 7.0,
                autoRotate: false,
                autoRotateSpeed: 2.0,
                enableKeys: true,
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.orbitOptions,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { minDistance, maxDistance, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, enableDamping, dampingFactor,
            enableZoom, zoomSpeed, enableRotate, rotateSpeed, enablePan, panSpeed, screenSpacePanning, keyPanSpeed, autoRotate, autoRotateSpeed,
            enableKeys } = Object.assign({}, this.state, {
                [name]: value,
            });

        Object.assign(this.selected.userData.orbitOptions, {
            minDistance, maxDistance, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, enableDamping, dampingFactor,
            enableZoom, zoomSpeed, enableRotate, rotateSpeed, enablePan, panSpeed, screenSpacePanning, keyPanSpeed, autoRotate, autoRotateSpeed,
            enableKeys
        });

        app.call('objectChanged', this, this.selected);
    }
}

export default OrbitControlComponent;