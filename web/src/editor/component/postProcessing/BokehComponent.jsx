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
 * 背景虚化特效组件
 * @author tengge / https://github.com/tengge1
 */
class BokehComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            focus: 50, // 距离相机距离，哪里最清晰
            aperture: 2.8, // *1e-4，光圈越小越清楚
            maxBlur: 1 // 最大模糊程度，越大越模糊
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, focus, aperture, maxBlur } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Bokeh Effect')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('EnableState')}
                name={'enabled'}
                value={enabled}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Focus')}
                name={'focus'}
                value={focus}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Aperture')}
                name={'aperture'}
                value={aperture}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MaxBlur')}
                name={'maxBlur'}
                value={maxBlur}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BokehComponent`, this.handleUpdate);
        app.on(`objectChanged.BokehComponent`, this.handleUpdate);
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
            enabled: postProcessing.bokeh ? postProcessing.bokeh.enabled : false,
            focus: postProcessing.bokeh ? postProcessing.bokeh.focus : this.state.focus,
            aperture: postProcessing.bokeh ? postProcessing.bokeh.aperture : this.state.aperture,
            maxBlur: postProcessing.bokeh ? postProcessing.bokeh.maxBlur : this.state.maxBlur
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

        const { enabled, focus, aperture, maxBlur } = Object.assign({}, this.state, {
            [name]: value
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            bokeh: {
                enabled,
                focus,
                aperture,
                maxBlur
            }
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default BokehComponent;