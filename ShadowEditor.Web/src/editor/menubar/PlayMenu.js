import UI from '../../ui/UI';

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
            id: 'mPlay',
            scope: this.id,
            cls: 'title',
            html: L_PLAY,
            onClick: this.onTogglePlay.bind(this),
        }, , {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                id: 'mPlaySub',
                scope: this.id,
                cls: 'option',
                html: '播放',
                onClick: this.onTogglePlay.bind(this),
            },
            // {
            //     xtype: 'div',
            //     cls: 'option',
            //     html: '全屏播放',
            //     onClick: this.playFullscreen.bind(this),
            // }, 
            {
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
    var playSub = UI.get('mPlaySub', this.id);

    play.dom.innerHTML = L_STOP;
    playSub.dom.innerHTML = L_STOP;

    this.app.player.start();
};

PlayMenu.prototype.stopPlay = function () { // 停止播放
    if (!this.isPlaying) {
        return;
    }

    this.isPlaying = false;

    var play = UI.get('mPlay', this.id);
    var playSub = UI.get('mPlaySub', this.id);

    play.dom.innerHTML = L_PLAY;
    playSub.dom.innerHTML = L_PLAY;

    this.app.player.stop();
};

// PlayMenu.prototype.playFullscreen = function () { // 全屏播放
//     var dom = this.app.editor.renderer.domElement;
//     dom.requestFullscreen();
//     this.startPlayer();
// };

PlayMenu.prototype.playNewWindow = function () { // 新窗口播放
    UI.msg('新窗口播放！');
};

export default PlayMenu;