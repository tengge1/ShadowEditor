/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty, SelectProperty } from '../../ui/index';

/**
 * 阴影组件
 * @author tengge / https://github.com/tengge1
 */
class ShadowComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.mapSize = {
            '512': '512*512',
            '1024': '1024*1024',
            '2048': '2048*2048',
            '4096': '4096*4096'
        };

        this.state = {
            show: false,
            expanded: false,

            castShadow: false,
            castShadowShow: false,

            receiveShadow: false,
            receiveShadowShow: false,

            shadowRadius: 1,
            shadowRadiusShow: false,

            mapSize: 512,
            mapSizeShow: false,

            bias: 0,
            biasShow: false,

            cameraLeft: -5,
            cameraRight: 5,
            cameraTop: 5,
            cameraBottom: -5,
            cameraNear: 0.5,
            cameraFar: 1000,
            cameraShow: false
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangeCastShadow = this.handleChangeCastShadow.bind(this);
        this.handleChangeReceiveShadow = this.handleChangeReceiveShadow.bind(this);
        this.handleChangeShadowRadius = this.handleChangeShadowRadius.bind(this);
        this.handleChangeMapSize = this.handleChangeMapSize.bind(this);
        this.handleChangeBias = this.handleChangeBias.bind(this);
        this.handleChangeCameraLeft = this.handleChangeCameraLeft.bind(this);
        this.handleChangeCameraRight = this.handleChangeCameraRight.bind(this);
        this.handleChangeCameraTop = this.handleChangeCameraTop.bind(this);
        this.handleChangeCameraBottom = this.handleChangeCameraBottom.bind(this);
        this.handleChangeCameraNear = this.handleChangeCameraNear.bind(this);
        this.handleChangeCameraFar = this.handleChangeCameraFar.bind(this);
    }

    render() {
        const { show, expanded, castShadow, castShadowShow, receiveShadow, receiveShadowShow, shadowRadius, shadowRadiusShow, mapSize, mapSizeShow, bias, biasShow,
            cameraLeft, cameraRight, cameraTop, cameraBottom, cameraNear, cameraFar, cameraShow } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Shadow Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('Cast')}
                name={'castShadow'}
                value={castShadow}
                show={castShadowShow}
                onChange={this.handleChangeCastShadow}
            />
            <CheckBoxProperty label={_t('Receive')}
                name={'receiveShadow'}
                value={receiveShadow}
                show={receiveShadowShow}
                onChange={this.handleChangeReceiveShadow}
            />
            <NumberProperty label={_t('Radius')}
                name={'shadowRadius'}
                value={shadowRadius}
                show={shadowRadiusShow}
                onChange={this.handleChangeShadowRadius}
            />
            <SelectProperty label={_t('MapSize')}
                options={this.mapSize}
                name={'mapSize'}
                value={mapSize.toString()}
                show={mapSizeShow}
                onChange={this.handleChangeMapSize}
            />
            <NumberProperty label={_t('Bias')}
                name={'bias'}
                value={bias}
                show={biasShow}
                onChange={this.handleChangeBias}
            />
            <NumberProperty label={_t('CameraLeft')}
                name={'cameraLeft'}
                value={cameraLeft}
                show={cameraShow}
                onChange={this.handleChangeCameraLeft}
            />
            <NumberProperty label={_t('CameraRight')}
                name={'cameraRight'}
                value={cameraRight}
                show={cameraShow}
                onChange={this.handleChangeCameraRight}
            />
            <NumberProperty label={_t('CameraTop')}
                name={'cameraTop'}
                value={cameraTop}
                show={cameraShow}
                onChange={this.handleChangeCameraTop}
            />
            <NumberProperty label={_t('CameraBottom')}
                name={'cameraBottom'}
                value={cameraBottom}
                show={cameraShow}
                onChange={this.handleChangeCameraBottom}
            />
            <NumberProperty label={_t('CameraNear')}
                name={'cameraNear'}
                value={cameraNear}
                show={cameraShow}
                onChange={this.handleChangeCameraNear}
            />
            <NumberProperty label={_t('CameraFar')}
                name={'cameraFar'}
                value={cameraFar}
                show={cameraShow}
                onChange={this.handleChangeCameraFar}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ShadowComponent`, this.handleUpdate);
        app.on(`objectChanged.ShadowComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh || editor.selected instanceof THREE.DirectionalLight || editor.selected instanceof THREE.PointLight || editor.selected instanceof THREE.SpotLight)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
            castShadow: this.selected.castShadow,
            castShadowShow: true
        };

        if (this.selected instanceof THREE.Light) {
            Object.assign(state, {
                receiveShadowShow: false,
                shadowRadius: this.selected.shadow.radius,
                shadowRadiusShow: true,
                mapSize: this.selected.shadow.mapSize.x,
                mapSizeShow: true,
                bias: this.selected.shadow.bias,
                biasShow: true,
                cameraLeft: this.selected.shadow.camera.left,
                cameraRight: this.selected.shadow.camera.right,
                cameraTop: this.selected.shadow.camera.top,
                cameraBottom: this.selected.shadow.camera.bottom,
                cameraNear: this.selected.shadow.camera.near,
                cameraFar: this.selected.shadow.camera.far,
                cameraShow: true
            });
        } else {
            Object.assign(state, {
                receiveShadow: this.selected.receiveShadow,
                receiveShadowShow: true,
                shadowRadiusShow: false,
                mapSizeShow: false,
                biasShow: false,
                cameraShow: false
            });
        }

        this.setState(state);
    }

    handleChangeCastShadow(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.castShadow = value;

        if (this.selected instanceof THREE.Mesh) {
            this.updateMaterial(this.selected.material);
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeReceiveShadow(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.receiveShadow = value;

        if (this.selected instanceof THREE.Mesh) {
            this.updateMaterial(this.selected.material);
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeShadowRadius(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.radius = value;

        app.call(`objectChanged`, this, this.selected);
    }

    updateMaterial(material) {
        if (Array.isArray(material)) {
            material.forEach(n => {
                n.needsUpdate = true;
            });
        } else {
            material.needsUpdate = true;
        }
    }

    handleChangeMapSize(value) {
        this.selected.shadow.mapSize.x = this.selected.shadow.mapSize.y = parseInt(value);

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBias(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.bias = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraLeft(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.camera.left = value;
        this.selected.shadow.camera.updateProjectionMatrix();

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraRight(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.camera.right = value;
        this.selected.shadow.camera.updateProjectionMatrix();

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraTop(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.camera.top = value;
        this.selected.shadow.camera.updateProjectionMatrix();

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraBottom(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.camera.bottom = value;
        this.selected.shadow.camera.updateProjectionMatrix();

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraNear(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.camera.near = value;
        this.selected.shadow.camera.updateProjectionMatrix();

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraFar(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.shadow.camera.far = value;
        this.selected.shadow.camera.updateProjectionMatrix();

        app.call(`objectChanged`, this, this.selected);
    }
}

export default ShadowComponent;