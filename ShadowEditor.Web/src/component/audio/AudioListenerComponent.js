import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AudioListenerComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

AudioListenerComponent.prototype = Object.create(BaseComponent.prototype);
AudioListenerComponent.prototype.constructor = AudioListenerComponent;

AudioListenerComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'audioListenerPanel',
        scope: this.id,
        cls: 'Panel',
        style: {
            borderTop: 0,
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
                text: '音频监听'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '主音量'
            }, {
                xtype: 'number',
                id: 'masterVolume',
                scope: this.id,
                range: [0, 1],
                value: 1,
                onChange: this.onChangeMasterVolume.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

AudioListenerComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

AudioListenerComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

AudioListenerComponent.prototype.updateUI = function () {
    var container = UI.get('audioListenerPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.PerspectiveCamera && editor.selected.children.indexOf(editor.audioListener) > -1) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.audioListener;

    var masterVolume = UI.get('masterVolume', this.id);

    masterVolume.setValue(this.selected.getMasterVolume());
};

AudioListenerComponent.prototype.onChangeMasterVolume = function () {
    var masterVolume = UI.get('masterVolume', this.id);

    this.selected.setMasterVolume(masterVolume.getValue());
};

export default AudioListenerComponent;