/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../ui/index';

/**
 * 半色调特效组件
 * @author tengge / https://github.com/tengge1
 */
class HalftoneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.shape = {
            1: _t('Point'),
            2: _t('Ellipse'),
            3: _t('Line'),
            4: _t('Square')
        };

        this.blendingMode = {
            1: _t('Linear'),
            2: _t('Multiply'),
            3: _t('Add together'),
            4: _t('Lighter'),
            5: _t('Darker')
        };

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            shape: 1,
            radius: 4,
            rotateR: 15,
            rotateG: 45,
            rotateB: 30,
            scatter: 0,
            blending: 1,
            blendingMode: 1,
            greyscale: false
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, shape, radius, rotateR, rotateG, rotateB, scatter, blending, blendingMode, greyscale } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Halftone Effect')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('EnableState')}
                name={'enabled'}
                value={enabled}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Shape')}
                options={this.shape}
                name={'shape'}
                value={shape}
                onChange={this.handleChange}
            />
            <IntegerProperty label={_t('Radius')}
                name={'radius'}
                value={radius}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('RotateRed')}
                name={'rotateR'}
                value={rotateR}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('RotateGreen')}
                name={'rotateG'}
                value={rotateG}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('RotateBlue')}
                name={'rotateB'}
                value={rotateB}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Scatter')}
                name={'scatter'}
                value={scatter}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Blending')}
                name={'blending'}
                value={blending}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('BlendingMode')}
                options={this.blendingMode}
                name={'blendingMode'}
                value={blendingMode}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('GreyScale')}
                name={'greyscale'}
                value={greyscale}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.HalftoneComponent`, this.handleUpdate);
        app.on(`objectChanged.HalftoneComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.scene) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let scene = this.selected;
        let postProcessing = scene.userData.postProcessing || {};

        let state = {
            show: true,
            enabled: postProcessing.halftone ? postProcessing.halftone.enabled : false,
            shape: postProcessing.halftone ? postProcessing.halftone.shape : this.state.shape,
            radius: postProcessing.halftone ? postProcessing.halftone.radius : this.state.radius,
            rotateR: postProcessing.halftone ? postProcessing.halftone.rotateR : this.state.rotateR,
            rotateB: postProcessing.halftone ? postProcessing.halftone.rotateB : this.state.rotateG,
            rotateG: postProcessing.halftone ? postProcessing.halftone.rotateG : this.state.rotateB,
            scatter: postProcessing.halftone ? postProcessing.halftone.scatter : this.state.scatter,
            blending: postProcessing.halftone ? postProcessing.halftone.blending : this.state.blending,
            blendingMode: postProcessing.halftone ? postProcessing.halftone.blendingMode : this.state.blendingMode,
            greyscale: postProcessing.halftone ? postProcessing.halftone.greyscale : this.state.greyscale
        };

        this.setState(state);
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { enabled, shape, radius, rotateR, rotateG, rotateB, scatter, blending, blendingMode, greyscale } = Object.assign({}, this.state, {
            [name]: value
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            halftone: {
                enabled,
                shape,
                radius,
                rotateR,
                rotateG,
                rotateB,
                scatter,
                blending,
                blendingMode,
                greyscale
            }
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default HalftoneComponent;