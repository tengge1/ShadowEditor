/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, SelectProperty } from '../../../ui/index';

/**
 * 全屏抗锯齿(SSAA)组件
 * @author tengge / https://github.com/tengge1
 */
class SsaaComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.sampleLevel = {
            0: _t('1 Sample'),
            1: _t('2 Samples'),
            2: _t('4 Samples'),
            3: _t('8 Samples'),
            4: _t('16 Samples'),
            5: _t('32 Samples')
        };

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            sampleLevel: 3,
            unbiased: true
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, sampleLevel, unbiased } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('SSAA')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('EnableState')}
                name={'enabled'}
                value={enabled}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('Level')}
                options={this.sampleLevel}
                name={'sampleLevel'}
                value={sampleLevel}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Unbiased')}
                name={'unbiased'}
                value={unbiased}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SsaaComponent`, this.handleUpdate);
        app.on(`objectChanged.SsaaComponent`, this.handleUpdate);
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
            enabled: postProcessing.ssaa ? postProcessing.ssaa.enabled : false,
            sampleLevel: postProcessing.ssaa ? postProcessing.ssaa.sampleLevel : this.state.sampleLevel,
            unbiased: postProcessing.ssaa ? postProcessing.ssaa.unbiased : this.state.unbiased
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

        const { enabled, sampleLevel, unbiased } = Object.assign({}, this.state, {
            [name]: value
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            ssaa: {
                enabled,
                sampleLevel,
                unbiased
            }
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default SsaaComponent;