/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, NumberProperty, ColorProperty } from '../../ui/index';

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
            color: '#ffffff',

            showIntensity: false,
            intensity: 1,

            showDistance: false,
            distance: 0,

            showAngle: false,
            angle: Math.PI * 0.1,

            showPenumbra: false,
            penumbra: 0,

            showDecay: false,
            decay: 1,

            showSkyColor: false,
            skyColor: '#00aaff',

            showGroundColor: false,
            groundColor: '#ffaa00',

            showWidth: false,
            width: 20,

            showHeight: false,
            height: 10
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
            showHeight, height
        } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Light Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <ColorProperty label={_t('Color')}
                name={'color'}
                value={color}
                show={showColor}
                onChange={this.handleChangeColor}
            />
            <NumberProperty label={_t('Intensity')}
                name={'intensity'}
                value={intensity}
                show={showIntensity}
                onChange={this.handleChangeIntensity}
            />
            <NumberProperty label={_t('Distance')}
                name={'distance'}
                value={distance}
                show={showDistance}
                onChange={this.handleChangeDistance}
            />
            <NumberProperty label={_t('Angle')}
                name={'angle'}
                value={angle}
                show={showAngle}
                onChange={this.handleChangeAngle}
            />
            <NumberProperty label={_t('Penumbra')}
                name={'penumbra'}
                value={penumbra}
                show={showPenumbra}
                onChange={this.handleChangePenumbra}
            />
            <NumberProperty label={_t('Decay')}
                name={'decay'}
                value={decay}
                show={showDecay}
                onChange={this.handleChangeDecay}
            />
            <ColorProperty label={_t('SkyColor')}
                name={'skyColor'}
                value={skyColor}
                show={showSkyColor}
                onChange={this.handleChangeSkyColor}
            />
            <ColorProperty label={_t('GroundColor')}
                name={'groundColor'}
                value={groundColor}
                show={showGroundColor}
                onChange={this.handleChangeGroundColor}
            />
            <NumberProperty label={_t('Width')}
                name={'width'}
                value={width}
                show={showWidth}
                onChange={this.handleChangeWidth}
            />
            <NumberProperty label={_t('Height')}
                name={'height'}
                value={height}
                show={showHeight}
                onChange={this.handleChangeHeight}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.LightComponent`, this.handleUpdate);
        app.on(`objectChanged.LightComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Light)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true
        };

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

        this.setState(state);
    }

    handleChangeColor(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.color = new THREE.Color(value);

        let helper = this.selected.children.filter(n => n.userData.type === 'helper')[0];

        if (helper) {
            helper.material.color = this.selected.color;
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeIntensity(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.intensity = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeDistance(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.distance = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeAngle(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.angle = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangePenumbra(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.penumbra = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeDecay(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.decay = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeSkyColor(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.color = new THREE.Color(value);

        let sky = this.selected.children.filter(n => n.userData.type === 'sky')[0];

        if (sky) {
            sky.material.uniforms.topColor.value = this.selected.color;
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeGroundColor(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.groundColor = new THREE.Color(value);

        let ground = this.selected.children.filter(n => n.userData.type === 'sky')[0];

        if (ground) {
            ground.material.uniforms.bottomColor.value = this.selected.groundColor;
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeWidth(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.width = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeHeight(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.height = value;

        app.call(`objectChanged`, this, this.selected);
    }
}

export default LightComponent;