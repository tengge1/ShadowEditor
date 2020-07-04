/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, DisplayProperty, CheckBoxProperty, NumberProperty, ButtonProperty } from '../../../ui/index';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 */
class BackgroundMusicComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            name: '',
            autoplay: false,
            loop: true,
            volume: 1,
            showPlayButton: false,
            isPlaying: false
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSelectAudio = this.onSelectAudio.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }

    render() {
        const { show, expanded, name, autoplay, loop, volume, showPlayButton, isPlaying } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Background Music')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <DisplayProperty label={_t('Audio')}
                name={'name'}
                value={name === '' ? `(${_t('None')})` : name}
                btnShow
                btnText={_t('Select')}
                onClick={this.handleSelect}
            />
            <CheckBoxProperty label={_t('Auto Play')}
                name={'autoplay'}
                value={autoplay}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Loop')}
                name={'loop'}
                value={loop}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Volume')}
                name={'volume'}
                value={volume}
                onChange={this.handleChange}
            />
            <ButtonProperty text={isPlaying ? _t('Stop') : _t('Play')}
                show={showPlayButton}
                onChange={this.handlePlay}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BackgroundMusicComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.BackgroundMusicComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Audio)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
            name: this.selected.userData.Name || '',
            autoplay: this.selected.userData.autoplay || false,
            loop: this.selected.getLoop(),
            volumn: this.selected.getVolume(),
            showPlayButton: this.selected.buffer !== null,
            isPlaying: this.selected.isPlaying || false
        };

        this.setState(state);
    }

    handleSelect() {
        app.call(`selectBottomPanel`, this, 'audio');
        app.toast(_t('Please click the audio in the Audio Panel.'));
        app.on(`selectAudio.BackgroundMusicComponent`, this.onSelectAudio);
    }

    onSelectAudio(obj) {
        app.on(`selectAudio.BackgroundMusicComponent`, null);

        Object.assign(this.selected.userData, obj);

        let loader = new THREE.AudioLoader();

        loader.load(obj.Url, buffer => {
            this.selected.setBuffer(buffer);

            this.setState({
                name: obj.Name,
                showPlayButton: true
            });
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { autoplay, loop, volumn } = Object.assign({}, this.state, {
            [name]: value
        });

        this.selected.userData.autoplay = autoplay; // 这里不能给this.selected赋值，否则音频会自动播放
        this.selected.setLoop(loop);
        this.selected.setVolume(volumn);

        app.call('objectChanged', this, this.selected);
    }

    handlePlay() {
        if (!this.selected.buffer) {
            this.setState({
                showPlayButton: false,
                isPlaying: false
            });
            return;
        }

        if (this.selected.isPlaying) {
            this.selected.stop();

        } else {
            this.selected.play();
        }

        this.setState({
            showPlayButton: true,
            isPlaying: this.selected.isPlaying
        });
    }
}

export default BackgroundMusicComponent;