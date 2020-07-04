/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, ButtonProperty, SelectProperty } from '../../ui/index';

/**
 * LMesh组件
 * @author tengge / https://github.com/tengge1
 */
class LMeshComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,
            options: [],
            animation: '',
            previewText: _t('Preview')
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const { show, expanded, options, animation, previewText } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('LMesh Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <SelectProperty label={_t('Animation')}
                name={'animation'}
                options={options}
                value={animation}
                onChange={this.handleChange}
            />
            <ButtonProperty text={previewText}
                onChange={this.handlePreview}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.LMeshComponent`, this.handleUpdate);
        app.on(`objectChanged.LMeshComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'lol')) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const model = this.selected.userData.model;
        const animNames = model.getAnimations();

        let options = {

        };

        animNames.forEach(n => {
            options[n] = n;
        });

        this.setState({
            show: true,
            options,
            animation: animNames[0],
            previewText: this.isPlaying ? _t('Cancel') : _t('Preview')
        });
    }

    handleChange(value) {
        const model = this.selected.userData.model;

        model.setAnimation(value);

        this.setState({ animation: value });
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        const animation = this.state.animation;

        if (!animation) {
            app.toast(`Please select animation.`);
            return;
        }

        this.isPlaying = true;

        this.setState({
            previewText: _t('Cancel')
        });

        const model = this.selected.userData.model;
        model.setAnimation(animation);

        app.on(`animate.LMeshComponent`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: _t('Preview')
        });

        app.on(`animate.LMeshComponent`, null);
    }

    onAnimate(clock) {
        var model = this.selected.userData.model;
        model.update(clock.elapsedTime * 1000);
    }
}

export default LMeshComponent;