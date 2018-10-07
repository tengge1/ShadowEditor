import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 纹理窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AudioWindow(options) {
    UI.ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = '音频列表';
    this.imageIcon = 'icon-audio';
    // this.cornerTextField = 'Type';
    this.uploadUrl = `${this.app.options.server}/api/Audio/Add`;
    this.preImageUrl = this.app.options.server;
    this.showUploadButton = true;

    this.beforeUpdateList = this.beforeUpdateAudioList;
    this.onUpload = this.onUploadAudio;
    this.onClick = this.onClickAudio;
    this.onEdit = this.onEditAudio;
    this.onDelete = this.onDeleteAudio;

    this.onSelect = options.onSelect || null;
}

AudioWindow.prototype = Object.create(UI.ImageListWindow.prototype);
AudioWindow.prototype.constructor = AudioWindow;

AudioWindow.prototype.beforeUpdateAudioList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/Audio/List`, obj => {
            resolve(obj.Data);
        });
    });
};

AudioWindow.prototype.onUploadAudio = function (obj) {
    this.update();
    UI.msg(obj.Msg);
};

AudioWindow.prototype.onClickAudio = function (data) {
    if (typeof (this.onSelect) === 'function') {
        this.onSelect(data);
    } else {
        UI.msg('请在音频相关控件中修改音乐。');
    }
};

AudioWindow.prototype.onEditAudio = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new TextureEditWindow({
            app: this.app,
            parent: this.parent,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

AudioWindow.prototype.onDeleteAudio = function (data) {
    var server = this.app.options.server;

    UI.confirm('询问', `是否删除音频${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Audio/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default AudioWindow;