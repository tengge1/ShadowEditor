/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty, SelectProperty } from '../../../ui/index';

/**
 * 可扩展环境光遮挡(SAO)组件
 * @author tengge / https://github.com/tengge1
 */
class SaoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.output = {
            1: _t('Beauty'), // THREE.SAOPass.OUTPUT.Beauty
            0: _t('Beauty&Occlusion'), // THREE.SAOPass.OUTPUT.Default
            2: _t('Occlusion'), // THREE.SAOPass.OUTPUT.SAO
            3: _t('Depth'), // THREE.SAOPass.OUTPUT.Depth
            4: _t('Normal') // THREE.SAOPass.OUTPUT.Normal
        };

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            output: 0,
            saoBias: 0.5,
            saoIntensity: 0.02,
            saoScale: 100,
            saoKernelRadius: 50,
            saoMinResolution: 0,
            saoBlur: true,
            saoBlurRadius: 16,
            saoBlurStdDev: 32.6,
            saoBlurDepthCutoff: 0.046
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, output, saoBias, saoIntensity, saoScale, saoKernelRadius, saoMinResolution, saoBlur, saoBlurRadius,
            saoBlurStdDev, saoBlurDepthCutoff } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('SAO')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('EnableState')}
                name={'enabled'}
                value={enabled}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Output')}
                options={this.output}
                name={'output'}
                value={output}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Bias')}
                name={'saoBias'}
                value={saoBias}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Intensity')}
                name={'saoIntensity'}
                value={saoIntensity}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Scale')}
                name={'saoScale'}
                value={saoScale}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('KernalRadius')}
                name={'saoKernelRadius'}
                value={saoKernelRadius}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MinResolution')}
                name={'saoMinResolution'}
                value={saoMinResolution}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Blur')}
                name={'saoBlur'}
                value={saoBlur}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('BlurRadius')}
                name={'saoBlurRadius'}
                value={saoBlurRadius}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('BlurStdDev')}
                name={'saoBlurStdDev'}
                value={saoBlurStdDev}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('BlurDepthCutoff')}
                name={'saoBlurDepthCutoff'}
                value={saoBlurDepthCutoff}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SaoComponent`, this.handleUpdate);
        app.on(`objectChanged.SaoComponent`, this.handleUpdate);
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
            enabled: postProcessing.sao ? postProcessing.sao.enabled : false,
            output: postProcessing.sao ? postProcessing.sao.output : this.state.output,
            saoBias: postProcessing.sao ? postProcessing.sao.saoBias : this.state.saoBias,
            saoIntensity: postProcessing.sao ? postProcessing.sao.saoIntensity : this.state.saoIntensity,
            saoScale: postProcessing.sao ? postProcessing.sao.saoScale : this.state.saoScale,
            saoKernelRadius: postProcessing.sao ? postProcessing.sao.saoKernelRadius : this.state.saoKernelRadius,
            saoMinResolution: postProcessing.sao ? postProcessing.sao.saoMinResolution : this.state.saoMinResolution,
            saoBlur: postProcessing.sao ? postProcessing.sao.saoBlur : this.state.saoBlur,
            saoBlurRadius: postProcessing.sao ? postProcessing.sao.saoBlurRadius : this.state.saoBlurRadius,
            saoBlurStdDev: postProcessing.sao ? postProcessing.sao.saoBlurStdDev : this.setState.saoBlurStdDev,
            saoBlurDepthCutoff: postProcessing.sao ? postProcessing.sao.saoBlurDepthCutoff : this.state.saoBlurDepthCutoff
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

        const { enabled, output, saoBias, saoIntensity, saoScale, saoKernelRadius, saoMinResolution, saoBlur, saoBlurRadius,
            saoBlurStdDev, saoBlurDepthCutoff } = Object.assign({}, this.state, {
                [name]: value
            });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            sao: {
                enabled,
                output,
                saoBias,
                saoIntensity,
                saoScale,
                saoKernelRadius,
                saoMinResolution,
                saoBlur,
                saoBlurRadius,
                saoBlurStdDev,
                saoBlurDepthCutoff
            }
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default SaoComponent;