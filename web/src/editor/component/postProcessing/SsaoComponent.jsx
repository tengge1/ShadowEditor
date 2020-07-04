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
 * 屏幕空间环境光遮蔽(SSAO)组件
 * @author tengge / https://github.com/tengge1
 */
class SsaoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.output = {
            0: _t('Default'), // THREE.SSAOPass.OUTPUT.Default
            1: _t('Occlusion'), // THREE.SSAOPass.OUTPUT.SSAO
            2: _t('Occlusion&Blur'), // THREE.SSAOPass.OUTPUT.Blur
            3: _t('Beauty'), // THREE.SSAOPass.OUTPUT.Beauty
            4: _t('Depth'), // THREE.SSAOPass.OUTPUT.Depth
            5: _t('Normal') // THREE.SSAOPass.OUTPUT.Normal
        };

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            output: 0,
            kernelRadius: 10,
            minDistance: 0.001,
            maxDistance: 0.1
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, output, kernelRadius, minDistance, maxDistance } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('SSAO')}
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
            <NumberProperty label={_t('KernalRadius')}
                name={'kernelRadius'}
                value={kernelRadius}
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
        app.on(`objectSelected.SsaoComponent`, this.handleUpdate);
        app.on(`objectChanged.SsaoComponent`, this.handleUpdate);
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
            enabled: postProcessing.ssao ? postProcessing.ssao.enabled : false,
            output: postProcessing.ssao ? postProcessing.ssao.output : this.state.output,
            kernelRadius: postProcessing.ssao ? postProcessing.ssao.kernelRadius : this.state.kernelRadius,
            minDistance: postProcessing.ssao ? postProcessing.ssao.minDistance : this.state.minDistance,
            maxDistance: postProcessing.ssao ? postProcessing.ssao.maxDistance : this.state.maxDistance
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

        const { enabled, output, kernelRadius, minDistance, maxDistance } = Object.assign({}, this.state, {
            [name]: value
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            ssao: {
                enabled,
                output,
                kernelRadius,
                minDistance,
                maxDistance
            }
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default SsaoComponent;