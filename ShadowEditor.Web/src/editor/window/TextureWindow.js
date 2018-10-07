import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import UploadUtils from '../../utils/UploadUtils';
import TextureEditWindow from './TextureEditWindow';

/**
 * 纹理窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextureWindow(options) {
    UI.ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = '纹理列表';
    this.imageIcon = 'icon-texture';
    this.cornerTextField = 'Type';
    this.uploadUrl = `${this.app.options.server}/api/Texture/Add`;
    this.preImageUrl = this.app.options.server;
    this.showUploadButton = true;

    this.beforeUpdateList = this.beforeUpdateSceneList;
    this.onUpload = this.onUploadTexture;
    this.onClick = this.onClickTexture;
    this.onEdit = this.onEditTexture;
    this.onDelete = this.onDeleteTexture;
}

TextureWindow.prototype = Object.create(UI.ImageListWindow.prototype);
TextureWindow.prototype.constructor = TextureWindow;

TextureWindow.prototype.beforeUpdateSceneList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/Texture/List`, obj => {
            resolve(obj.Data);
        });
    });
};

TextureWindow.prototype.onUploadTexture = function (obj) {
    this.update();
    UI.msg(obj.Msg);
};

TextureWindow.prototype.onClickTexture = function (data) {
    UI.msg('请在材质控件中修改纹理。');
};

TextureWindow.prototype.onEditTexture = function (data) {
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

TextureWindow.prototype.onDeleteTexture = function (data) {
    var server = this.app.options.server;

    UI.confirm('询问', `是否删除纹理${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Texture/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default TextureWindow;