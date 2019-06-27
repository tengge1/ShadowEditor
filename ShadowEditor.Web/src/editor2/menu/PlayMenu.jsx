import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 播放菜单
 * @author tengge / https://github.com/tengge1
 */
class PlayMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleTogglePlay = this.handleTogglePlay.bind(this);
        this.handlePlayFullscreen = this.handlePlayFullscreen.bind(this);
        this.handlePlayNewWindow = this.handlePlayNewWindow.bind(this);
    }

    render() {
        return <MenuItem title={L_PLAY}>
            <MenuItem title={L_PLAY} onClick={this.handleTogglePlay}></MenuItem>
            <MenuItem title={L_PLAY_FULLSCREEN} onClick={this.handlePlayFullscreen}></MenuItem>
            <MenuItem title={L_PLAY_NEW_WINDOW} onClick={this.handlePlayNewWindow}></MenuItem>
        </MenuItem>;
    }

    handleTogglePlay() {
        if (this.isPlaying) {
            this.stopPlay();
        } else {
            this.startPlay();
        }
    }

    handleStartPlay() { // 启动播放
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        var play = UI.get('mPlay', this.id);
        play.dom.innerHTML = L_STOP;

        // 将场景数据转换为字符串
        var jsons = (new Converter()).toJSON({
            options: this.app.options,
            scene: this.app.editor.scene,
            camera: this.app.editor.camera,
            renderer: this.app.editor.renderer,
            scripts: this.app.editor.scripts,
            animations: this.app.editor.animations,
            visual: this.app.editor.visual,
        });

        this.app.player.start(JSON.stringify(jsons));
    }

    handleStopPlay() { // 停止播放
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;

        var play = UI.get('mPlay', this.id);
        play.dom.innerHTML = L_PLAY;

        this.app.player.stop();
    }

    handlePlayFullscreen() { // 全屏播放
        if (!this.isPlaying) {
            this.startPlay();
        }

        UI.get('player', this.app.player.id).dom.requestFullscreen();
    }

    handlePlayNewWindow() { // 新窗口播放
        var sceneID = this.app.editor.sceneID;

        if (!sceneID) {
            UI.msg('请先保存场景！');
            return;
        }

        window.open(`view.html?sceneID=${sceneID}`, 'ShadowPlayer');
    }
}

export default PlayMenu;