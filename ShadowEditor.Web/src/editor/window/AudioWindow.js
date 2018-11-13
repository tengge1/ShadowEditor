import { UI } from '../../third_party';
import ImageListWindow from '../../ui/ImageListWindow';
import Ajax from '../../utils/Ajax';
import AudioEditWindow from './AudioEditWindow';

/**
 * 纹理窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AudioWindow(options) {
    ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = '音频列表';
    this.imageIcon = 'icon-audio';
    // this.cornerTextField = 'Type';
    this.uploadUrl = `${this.app.options.server}/api/Audio/Add`;
    this.preImageUrl = this.app.options.server;
    this.showUploadButton = true;

    this.onSelect = options.onSelect || null;
}

AudioWindow.prototype = Object.create(ImageListWindow.prototype);
AudioWindow.prototype.constructor = AudioWindow;

AudioWindow.prototype.beforeUpdateList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/Audio/List`, obj => {
            resolve(obj.Data);
        });
    });
};

AudioWindow.prototype.onUpload = function (obj) {
    this.update();
    UI.msg(obj.Msg);
};

AudioWindow.prototype.onClick = function (data) {
    if (typeof (this.onSelect) === 'function') {
        this.onSelect(data);
    } else {
        UI.msg('请在音频相关控件中修改音乐。');
    }
};

AudioWindow.prototype.onEdit = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new AudioEditWindow({
            app: this.app,
            parent: this.parent,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

AudioWindow.prototype.onDelete = function (data) {
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