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
 * 轨迹球控制器组件
 * @author tengge / https://github.com/tengge1
 */
class TrackballControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            rotateSpeed: 1.0,
            zoomSpeed: 1.2,
            panSpeed: 0.3,
            noRotate: false,
            noZoom: false,
            noPan: false,
            staticMoving: false,
            dynamicDampingFactor: 0.2,
            minDistance: 0,
            maxDistance: 99999
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, rotateSpeed, zoomSpeed, panSpeed, noRotate, noZoom, noPan, staticMoving, dynamicDampingFactor, minDistance, maxDistance } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Traceball Controls')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={_t('RotateSpeed')}
                name={'rotateSpeed'}
                value={rotateSpeed}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('ZoomSpeed')}
                name={'zoomSpeed'}
                value={zoomSpeed}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('PanSpeed')}
                name={'panSpeed'}
                value={panSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('NoRotate')}
                name={'noRotate'}
                value={noRotate}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('NoZoom')}
                name={'noZoom'}
                value={noZoom}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('NoPan')}
                name={'noPan'}
                value={noPan}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('StaticMoving')}
                name={'staticMoving'}
                value={staticMoving}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('DampingFactor')}
                name={'dynamicDampingFactor'}
                value={dynamicDampingFactor}
                onChange={this.handleChange}
            />
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
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TrackballControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.TrackballControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'TrackballControls') {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected.userData.trackballOptions === undefined) {
            this.selected.userData.trackballOptions = {
                rotateSpeed: 1.0,
                zoomSpeed: 1.2,
                panSpeed: 0.3,
                noRotate: false,
                noZoom: false,
                noPan: false,
                staticMoving: false,
                dynamicDampingFactor: 0.2,
                minDistance: 0,
                maxDistance: 99999
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.trackballOptions
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { rotateSpeed, zoomSpeed, panSpeed, noRotate, noZoom, noPan, staticMoving, dynamicDampingFactor, minDistance, maxDistance } = Object.assign({}, this.state, {
            [name]: value
        });

        Object.assign(this.selected.userData.trackballOptions, {
            rotateSpeed, zoomSpeed, panSpeed, noRotate, noZoom, noPan, staticMoving, dynamicDampingFactor, minDistance, maxDistance
        });

        app.call('objectChanged', this, this.selected);
    }
}

export default TrackballControlComponent;