/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup,  NumberProperty } from '../../../ui/index';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 */
class AudioListenerComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            masterVolume: 1
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, masterVolume } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('AudioListener')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={_t('Max Volume')}
                name={'masterVolume'}
                value={masterVolume}
                min={0}
                max={1}
                step={0.1}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.AudioListenerComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.AudioListenerComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.children.indexOf(editor.audioListener) === -1) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let audioListener = editor.audioListener;

        this.setState({
            show: true,
            masterVolume: audioListener.getMasterVolume()
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { masterVolume } = Object.assign({}, this.state, {
            [name]: value
        });

        let audioListener = app.editor.audioListener;

        audioListener.setMasterVolume(masterVolume);

        app.call('objectChanged', this, this.selected);
    }
}

export default AudioListenerComponent;