/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, ButtonProperty } from '../../../ui/index';

/**
 * 水组件
 * @author tengge / https://github.com/tengge1
 */
class WaterComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,
            previewText: _t('Preview')
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const { show, expanded, previewText } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Water Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <ButtonProperty text={previewText}
                onChange={this.handlePreview}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.WaterComponent`, this.handleUpdate);
        app.on(`objectChanged.WaterComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'Water')) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            previewText: this.isPlaying ? _t('Cancel') : _t('Preview')
        });
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        this.isPlaying = true;

        this.setState({
            previewText: _t('Cancel')
        });

        app.on(`animate.WaterComponent`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: _t('Preview')
        });

        app.on(`animate.WaterComponent`, null);
    }

    onAnimate() {
        this.selected.update();
    }
}

export default WaterComponent;