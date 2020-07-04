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
 * 像素特效组件
 * @author tengge / https://github.com/tengge1
 */
class PixelComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            pixelSize: 8
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, pixelSize } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('PixelEffect')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('EnableState')}
                name={'enabled'}
                value={enabled}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('PixelSize')}
                name={'pixelSize'}
                value={pixelSize}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.PixelComponent`, this.handleUpdate);
        app.on(`objectChanged.PixelComponent`, this.handleUpdate);
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
            enabled: postProcessing.pixel ? postProcessing.pixel.enabled : false,
            pixelSize: postProcessing.pixel ? postProcessing.pixel.pixelSize : this.state.pixelSize
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

        const { enabled, pixelSize } = Object.assign({}, this.state, {
            [name]: value
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            pixel: {
                enabled,
                pixelSize
            }
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default PixelComponent;