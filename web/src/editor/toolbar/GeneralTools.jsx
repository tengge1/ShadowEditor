/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { ToolbarSeparator, IconButton, ImageButton } from '../../ui/index';
import Converter from '../../utils/Converter';
import TimeUtils from '../../utils/TimeUtils';
import VideoRecorder from '../../utils/VideoRecorder';

let recorder = null;

/**
 * 通用工具
 * @author tengge / https://github.com/tengge1
 */
class GeneralTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'translate',
            view: 'perspective',
            isGridMode: false,
            isRecording: recorder ? recorder.running : false,
            isFirstPerspective: false
        };

        this.handleEnterSelectMode = this.handleEnterSelectMode.bind(this);
        this.handleEnterTranslateMode = this.handleEnterTranslateMode.bind(this);
        this.handleEnterRotateMode = this.handleEnterRotateMode.bind(this);
        this.handleEnterScaleMode = this.handleEnterScaleMode.bind(this);

        this.handlePerspective = this.handlePerspective.bind(this);
        this.handleFrontView = this.handleFrontView.bind(this);
        this.handleSideView = this.handleSideView.bind(this);
        this.handleTopView = this.handleTopView.bind(this);

        this.handleGridMode = this.handleGridMode.bind(this);

        this.handleScreenshot = this.handleScreenshot.bind(this);
        this.commitScreenshot = this.commitScreenshot.bind(this);
        this.handleRecord = this.handleRecord.bind(this);

        this.handleFirstPerspective = this.handleFirstPerspective.bind(this);
    }

    render() {
        const { mode, view, isGridMode, isRecording, isFirstPerspective } = this.state;
        const { enableAuthority, authorities } = app.server;

        return <>
            <IconButton
                icon={'select'}
                title={_t('Select')}
                selected={mode === 'select'}
                onClick={this.handleEnterSelectMode}
            />
            <IconButton
                icon={'translate'}
                title={_t('Translate')}
                selected={mode === 'translate'}
                onClick={this.handleEnterTranslateMode}
            />
            <IconButton
                icon={'rotate'}
                title={_t('Rotate')}
                selected={mode === 'rotate'}
                onClick={this.handleEnterRotateMode}
            />
            <IconButton
                icon={'scale'}
                title={_t('Scale')}
                selected={mode === 'scale'}
                onClick={this.handleEnterScaleMode}
            />
            <ToolbarSeparator />
            <ImageButton
                src={'assets/image/perspective-view.png'}
                title={_t('Perspective View')}
                selected={view === 'perspective'}
                onClick={this.handlePerspective}
            />
            <ImageButton
                src={'assets/image/front-view.png'}
                title={_t('Front View')}
                selected={view === 'front'}
                onClick={this.handleFrontView}
            />
            <ImageButton
                src={'assets/image/side-view.png'}
                title={_t('Side View')}
                selected={view === 'side'}
                onClick={this.handleSideView}
            />
            <ImageButton
                src={'assets/image/top-view.png'}
                title={_t('Top View')}
                selected={view === 'top'}
                onClick={this.handleTopView}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'grid'}
                title={_t('Grid Mode')}
                selected={isGridMode}
                onClick={this.handleGridMode}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'camera'}
                title={_t('Screenshot')}
                show={!enableAuthority || authorities.includes('ADD_SCREENSHOT')}
                onClick={this.handleScreenshot}
            />
            <IconButton
                icon={isRecording ? 'stop-record' : 'recorder'}
                title={isRecording ? _t('Stop') : _t('Record')}
                show={!enableAuthority || authorities.includes('ADD_VIDEO')}
                onClick={this.handleRecord}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'first-perspective'}
                title={_t('First Perspective')}
                selected={isFirstPerspective}
                onClick={this.handleFirstPerspective}
            />
            <ToolbarSeparator />
        </>;
    }

    // --------------------------------- 选择模式 -------------------------------------

    handleEnterSelectMode() {
        this.setState({ mode: 'select' });
        app.call('changeMode', this, 'select');
    }

    handleEnterTranslateMode() {
        this.setState({ mode: 'translate' });
        app.call('changeMode', this, 'translate');
    }

    handleEnterRotateMode() {
        this.setState({ mode: 'rotate' });
        app.call('changeMode', this, 'rotate');
    }

    handleEnterScaleMode() {
        this.setState({ mode: 'scale' });
        app.call('changeMode', this, 'scale');
    }

    // ------------------------------ 视角工具 ------------------------------------------

    handlePerspective() {
        app.call(`changeView`, this, 'perspective');
        this.setState({
            view: 'perspective'
        });
    }

    handleFrontView() {
        app.call(`changeView`, this, 'front');
        this.setState({
            view: 'front'
        });
    }

    handleSideView() {
        app.call(`changeView`, this, 'side');
        this.setState({
            view: 'side'
        });
    }

    handleTopView() {
        app.call(`changeView`, this, 'top');
        this.setState({
            view: 'top'
        });
    }

    // ----------------------------- 网格模式 ------------------------------------------

    handleGridMode() {
        const isGridMode = !this.state.isGridMode;

        if (isGridMode) {
            app.editor.scene.overrideMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
        } else {
            app.editor.scene.overrideMaterial = null;
        }

        this.setState({
            isGridMode
        });
    }

    // ---------------------------- 截图 ----------------------------------------------

    handleScreenshot() {
        app.on(`afterRender.Screenshot`, this.commitScreenshot);
    }

    commitScreenshot() {
        app.on(`afterRender.Screenshot`, null);

        const canvas = app.editor.renderer.domElement;
        const dataUrl = Converter.canvasToDataURL(canvas);
        const file = Converter.dataURLtoFile(dataUrl, TimeUtils.getDateTime());

        let form = new FormData();
        form.append('file', file);

        fetch(`/api/Screenshot/Add`, {
            method: 'POST',
            body: form
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                app.toast(_t(obj.Msg), 'success');
            });
        });
    }

    // ------------------------------ 视频录制 --------------------------------------

    handleRecord() {
        if (this.state.isRecording) {
            this.stopRecord();
        } else {
            this.startRecord();
        }
    }

    startRecord() {
        if (recorder === null) {
            recorder = new VideoRecorder();
        }

        recorder.start().then(success => {
            if (success) {
                this.setState({
                    isRecording: true
                });
            }
        });
    }

    stopRecord() {
        if (!recorder) {
            return;
        }

        recorder.stop().then(() => {
            this.setState({
                isRecording: false
            });
        });
    }

    // --------------------------- 第一视角 ------------------------------

    handleFirstPerspective() {
        let controls = app.editor.controls;

        controls.on(`change.FirstPerspective`, (enabled, controlName) => {
            if (controlName !== 'FirstPersonControls') {
                return;
            }
            this.setState({
                isFirstPerspective: enabled
            });
        });

        controls.changeMode('FirstPersonControls');
    }
}

export default GeneralTools;