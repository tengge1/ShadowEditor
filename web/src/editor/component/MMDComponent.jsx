/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, DisplayProperty } from '../../ui/index';

/**
 * MMD模型组件
 * @author tengge / https://github.com/tengge1
 */
class MMDComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,

            animation: null,
            cameraAnimation: null,
            audio: null
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleSelectAnimation = this.handleSelectAnimation.bind(this);
        this.onSelectAnimation = this.onSelectAnimation.bind(this);
        this.handleSelectCameraAnimation = this.handleSelectCameraAnimation.bind(this);
        this.onSelectCameraAnimation = this.onSelectCameraAnimation.bind(this);
        this.handleSelectAudio = this.handleSelectAudio.bind(this);
        this.onSelectAudio = this.onSelectAudio.bind(this);
    }

    render() {
        const { show, expanded, animation, cameraAnimation, audio } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('MMD Model')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <DisplayProperty label={_t('Model Animation')}
                name={'animation'}
                value={animation}
                btnShow
                btnText={_t('Select')}
                onClick={this.handleSelectAnimation}
            />
            <DisplayProperty label={_t('Camera Animation')}
                name={'cameraAnimation'}
                value={cameraAnimation}
                btnShow
                btnText={_t('Select')}
                onClick={this.handleSelectCameraAnimation}
            />
            <DisplayProperty label={_t('Audio')}
                name={'audio'}
                value={audio}
                btnShow
                btnText={_t('Select')}
                onClick={this.handleSelectAudio}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MMDComponent`, this.handleUpdate);
        app.on(`objectChanged.MMDComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.Type === 'pmd' || editor.selected.userData.Type === 'pmx')) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
            animation: this.selected.userData.Animation ? this.selected.userData.Animation.Name : null,
            cameraAnimation: this.selected.userData.CameraAnimation ? this.selected.userData.CameraAnimation.Name : null,
            audio: this.selected.userData.Audio ? this.selected.userData.Audio.Name : null
        };

        this.setState(state);
    }

    // ----------------------------- 模型动画 ------------------------------------------

    handleSelectAnimation() {
        app.call(`selectBottomPanel`, this, 'animation');
        app.toast(_t('Please click the animation in the animation panel.'));
        app.on(`selectAnimation.MMDComponent`, this.onSelectAnimation);
    }

    onSelectAnimation(data) {
        if (data.Type !== 'mmd') {
            app.toast(_t('Please select MMD animation only.'), 'warn');
            return;
        }
        app.on(`selectAnimation.MMDComponent`, null);

        this.selected.userData.Animation = {};
        Object.assign(this.selected.userData.Animation, data);

        app.call(`objectChanged`, this, this.selected);
    }

    // ---------------------------- 相机动画 -------------------------------------------

    handleSelectCameraAnimation() {
        app.call(`selectBottomPanel`, this, 'animation');
        app.toast(_t('Please select camera animation.'));
        app.on(`selectAnimation.MMDComponent`, this.onSelectCameraAnimation);
    }

    onSelectCameraAnimation(data) {
        if (data.Type !== 'mmd') {
            app.toast(_t('Please select camera animation only.'), 'warn');
            return;
        }
        app.on(`selectAnimation.MMDComponent`, null);

        this.selected.userData.CameraAnimation = {};
        Object.assign(this.selected.userData.CameraAnimation, data);

        app.call(`objectChanged`, this, this.selected);
    }

    // ------------------------------ MMD音乐 --------------------------------------------

    handleSelectAudio() {
        app.call(`selectBottomPanel`, this, 'audio');
        app.toast(_t('Please select MMD audio.'));
        app.on(`selectAudio.MMDComponent`, this.onSelectAudio.bind(this));
    }

    onSelectAudio(data) {
        app.on(`selectAudio.MMDComponent`, null);

        this.selected.userData.Audio = {};
        Object.assign(this.selected.userData.Audio, data);

        app.call(`objectChanged`, this, this.selected);
    }
}

export default MMDComponent;