import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';
import AudioWindow from '../../editor/window/AudioWindow';

/**
 * 背景音乐组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BackgroundMusicComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

BackgroundMusicComponent.prototype = Object.create(BaseComponent.prototype);
BackgroundMusicComponent.prototype.constructor = BackgroundMusicComponent;

BackgroundMusicComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'backgroundMusicPanel',
        scope: this.id,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '背景音乐'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '音频'
            }, {
                xtype: 'text',
                id: 'name',
                scope: this.id,
                text: '(无)',
                style: {
                    width: '80px',
                    border: '1px solid #ddd',
                    marginRight: '8px'
                }
            }, {
                xtype: 'button',
                text: '选择',
                onClick: this.onSelect.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '自动播放'
            }, {
                xtype: 'checkbox',
                id: 'autoplay',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '循环播放'
            }, {
                xtype: 'checkbox',
                id: 'loop',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '音量'
            }, {
                xtype: 'number',
                id: 'volumn',
                scope: this.id,
                range: [0, 1],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label'
            }, {
                xtype: 'button',
                id: 'btnPlay',
                scope: this.id,
                text: '播放',
                style: {
                    display: 'none'
                },
                onClick: this.onPlay.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

BackgroundMusicComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

BackgroundMusicComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

BackgroundMusicComponent.prototype.updateUI = function () {
    var container = UI.get('backgroundMusicPanel', this.id);

    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Audio) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var name = UI.get('name', this.id);
    var autoplay = UI.get('autoplay', this.id);
    var loop = UI.get('loop', this.id);
    var volumn = UI.get('volumn', this.id);
    var btnPlay = UI.get('btnPlay', this.id);

    name.setValue(this.selected.userData.Name);
    autoplay.setValue(this.selected.userData.autoplay);
    loop.setValue(this.selected.getLoop());
    volumn.setValue(this.selected.getVolume());

    if (this.selected.buffer) {
        btnPlay.dom.style.display = '';
        if (this.selected.isPlaying) {
            btnPlay.setText('停止');
        } else {
            btnPlay.setText('播放');
        }
    } else {
        btnPlay.dom.style.display = 'none';
    }
};

BackgroundMusicComponent.prototype.onSelect = function () {
    if (this.window === undefined) {
        this.window = new AudioWindow({
            app: this.app,
            onSelect: this.onChange.bind(this)
        });
        this.window.render();
    }
    this.window.show();
};

BackgroundMusicComponent.prototype.onChange = function (obj) {
    var name = UI.get('name', this.id);
    var autoplay = UI.get('autoplay', this.id);
    var loop = UI.get('loop', this.id);
    var volumn = UI.get('volumn', this.id);
    var btnPlay = UI.get('btnPlay', this.id);

    if (obj) { // 仅选择窗口会传递obj参数
        Object.assign(this.selected.userData, obj);
        var loader = new THREE.AudioLoader();
        loader.load(obj.Url, buffer => {
            this.selected.setBuffer(buffer);
            btnPlay.dom.style.display = '';
        });
    }

    this.selected.userData.autoplay = autoplay.getValue(); // 这里不能给this.selected赋值，否则音频会自动播放
    this.selected.setLoop(loop.getValue());
    this.selected.setVolume(volumn.getValue());
    this.updateUI();

    if (this.window) {
        this.window.hide();
    }
};

BackgroundMusicComponent.prototype.onPlay = function () {
    var btnPlay = UI.get('btnPlay', this.id);

    if (this.selected.buffer) {
        btnPlay.dom.style.display = '';
        if (this.selected.isPlaying) {
            this.selected.stop();
            btnPlay.setText('播放');
        } else {
            this.selected.play();
            btnPlay.setText('停止');
        }
    } else {
        btnPlay.dom.style.display = 'none';
    }
};

export default BackgroundMusicComponent;