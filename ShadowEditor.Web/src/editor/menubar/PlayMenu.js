import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';

/**
 * 启动菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PlayMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.isPlaying = false;
}

PlayMenu.prototype = Object.create(UI.Control.prototype);
PlayMenu.prototype.constructor = PlayMenu;

PlayMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_PLAY
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mPlay',
                scope: this.id,
                cls: 'option',
                html: '播放',
                onClick: this.onTogglePlay.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: '全屏播放',
                onClick: this.playFullscreen.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: '新窗口播放',
                onClick: this.playNewWindow.bind(this),
            }]
        }]
    });

    container.render();
}

PlayMenu.prototype.onTogglePlay = function () {
    if (this.isPlaying) {
        this.stopPlay();
    } else {
        this.startPlay();
    }
};

PlayMenu.prototype.startPlay = function () { // 启动播放
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
    });

    this.app.player.start(JSON.stringify(jsons));
};

PlayMenu.prototype.stopPlay = function () { // 停止播放
    if (!this.isPlaying) {
        return;
    }

    this.isPlaying = false;

    var play = UI.get('mPlay', this.id);
    play.dom.innerHTML = L_PLAY;

    this.app.player.stop();
};

PlayMenu.prototype.playFullscreen = function () { // 全屏播放
    if (!this.isPlaying) {
        this.startPlay();
    }

    UI.get('player', this.app.player.id).dom.requestFullscreen();
};

PlayMenu.prototype.playNewWindow = function () { // 新窗口播放
    var sceneID = this.app.editor.sceneID;

    if (!sceneID) {
        UI.msg('请先保存场景！');
        return;
    }

    window.open(`view.html?sceneID=${sceneID}`, 'ShadowPlayer');
};

export default PlayMenu;