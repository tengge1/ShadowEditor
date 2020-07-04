/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty } from '../../../ui/index';

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
            expanded: false,
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
            enableKeys: true
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

        return <PropertyGroup title={_t('Orbit Controls')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={_t('MinDistance')}
                name={'minDistance'}
                value={minDistance}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MaxDistance')}
                name={'maxDistance'}
                value={maxDistance}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MinPolarAngle')}
                name={'minPolarAngle'}
                value={minPolarAngle}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MaxPolarAngle')}
                name={'maxPolarAngle'}
                value={maxPolarAngle}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MinAzimuthAngle')}
                name={'minAzimuthAngle'}
                value={minAzimuthAngle}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MaxAzimuthAngle')}
                name={'maxAzimuthAngle'}
                value={maxAzimuthAngle}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('EnableDamping')}
                name={'enableDamping'}
                value={enableDamping}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('DampingFactor')}
                name={'dampingFactor'}
                value={dampingFactor}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('EnableZoom')}
                name={'enableZoom'}
                value={enableZoom}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('ZoomSpeed')}
                name={'zoomSpeed'}
                value={zoomSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('EnableRotate')}
                name={'enableRotate'}
                value={enableRotate}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('RotateSpeed')}
                name={'rotateSpeed'}
                value={rotateSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('PanSpeed')}
                name={'enablePan'}
                value={enablePan}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('PanSpeed')}
                name={'panSpeed'}
                value={panSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('ScreenSpacePanning')}
                name={'screenSpacePanning'}
                value={screenSpacePanning}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('KeyPanSpeed')}
                name={'keyPanSpeed'}
                value={keyPanSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('AutoRotate')}
                name={'autoRotate'}
                value={autoRotate}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('AutoRotateSpeed')}
                name={'autoRotateSpeed'}
                value={autoRotateSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('EnableKeys')}
                name={'enableKeys'}
                value={enableKeys}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.OrbitControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.OrbitControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'OrbitControls') {
            this.setState({
                show: false
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
                enableKeys: true
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.orbitOptions
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { minDistance, maxDistance, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, enableDamping, dampingFactor,
            enableZoom, zoomSpeed, enableRotate, rotateSpeed, enablePan, panSpeed, screenSpacePanning, keyPanSpeed, autoRotate, autoRotateSpeed,
            enableKeys } = Object.assign({}, this.state, {
                [name]: value
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