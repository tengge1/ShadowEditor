/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuItem } from '../../ui/index';
import Converter from '../../serialization/Converter';

/**
 * 播放菜单
 * @author tengge / https://github.com/tengge1
 */
class PlayMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false
        };

        this.handleTogglePlay = this.handleTogglePlay.bind(this);
        this.handlePlayFullscreen = this.handlePlayFullscreen.bind(this);
        this.handlePlayNewWindow = this.handlePlayNewWindow.bind(this);
    }

    render() {
        const { isPlaying } = this.state;

        const isLogin = !app.server.enableAuthority || app.server.isLogin;

        return <MenuItem title={_t('Play')}>
            <MenuItem title={isPlaying ? _t('Stop') : _t('Play')}
                onClick={this.handleTogglePlay}
            />
            <MenuItem title={_t('Play Fullscreen')}
                onClick={this.handlePlayFullscreen}
            />
            {isLogin && <MenuItem title={_t('Play New Window')}
                onClick={this.handlePlayNewWindow}
                        />}
        </MenuItem>;
    }

    handleTogglePlay() {
        if (this.state.isPlaying) {
            this.handleStopPlay();
        } else {
            this.handleStartPlay();
        }
    }

    handleStartPlay() { // 启动播放
        if (this.state.isPlaying) {
            return;
        }

        this.setState({
            isPlaying: true
        });

        // 将场景数据转换为字符串
        var jsons = new Converter().toJSON({
            options: app.options,
            scene: app.editor.scene,
            camera: app.editor.camera,
            renderer: app.editor.renderer,
            scripts: app.editor.scripts,
            animations: app.editor.animations,
            visual: app.editor.visual
        });

        app.player.start(JSON.stringify(jsons));
    }

    handleStopPlay() { // 停止播放
        if (!this.state.isPlaying) {
            return;
        }

        this.setState({
            isPlaying: false
        });

        app.player.stop();

        this.setState;
    }

    handlePlayFullscreen() { // 全屏播放
        if (!this.state.isPlaying) {
            this.handleStartPlay();
        }

        app.playerRef.requestFullscreen();
    }

    handlePlayNewWindow() { // 新窗口播放
        let sceneID = app.editor.sceneID;

        if (!sceneID) {
            app.toast(_t('Please save scene first.'), 'warn');
            return;
        }

        window.open(`view.html?sceneID=${sceneID}`, 'ShadowPlayer');
    }
}

export default PlayMenu;