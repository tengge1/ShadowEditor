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
                text: '音乐'
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
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var backgroundMusic = this.selected.userData.backgroundMusic;

    if (backgroundMusic) {
        var name = UI.get('name', this.id);
        name.setValue(backgroundMusic.Name);
    }
};

BackgroundMusicComponent.prototype.onSelect = function () {
    if (this.window === undefined) {
        this.window = new AudioWindow({
            app: this.app,
            onSelect: this.onSelectAudio.bind(this)
        });
        this.window.render();
    }
    this.window.show();
};

BackgroundMusicComponent.prototype.onSelectAudio = function (obj) {
    this.selected.userData.backgroundMusic = this.selected.userData.backgroundMusic || {};
    Object.assign(this.selected.userData.backgroundMusic, obj);
    this.updateUI();
    this.window.hide();

    // var listener = this.app.editor.audioListener;

    // var sound = new THREE.Audio(listener);

    // var loader = new THREE.AudioLoader();

    // loader.load(this.app.options.server + model.Url, buffer => {
    //     sound.setBuffer(buffer);
    //     sound.setLoop(true);
    //     sound.setVolume(1.0);
    //     sound.play();
    // });
};

export default BackgroundMusicComponent;