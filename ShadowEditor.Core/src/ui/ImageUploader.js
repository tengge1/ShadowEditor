import { Control, UI } from '../third_party';
import UploadUtils from '../utils/UploadUtils';

/**
 * 图片上传控件
 * @param {*} options 
 */
function ImageUploader(options) {
    Control.call(this, options);
    options = options || {};

    this.url = options.url || null;
    this.server = options.server || '';

    this.input = document.createElement('input');
    this.input.id = `file_${this.id}`;
    this.input.type = 'file';
    this.input.style.display = 'none';
    this.input.addEventListener('change', this.onChange.bind(this));
    document.body.appendChild(this.input);
}

ImageUploader.prototype = Object.create(Control.prototype);
ImageUploader.prototype.constructor = ImageUploader;

ImageUploader.prototype.render = function () {
    if (this.dom) {
        this.dom.removeEventListener('click', this.onClick.bind(this));
        this.parent.removeChild(this.dom);
    }

    if (this.url) {
        this.dom = document.createElement('img');
        this.dom.className = 'Uploader';
        this.dom.src = this.server + this.url;
    } else {
        this.dom = document.createElement('div');
        this.dom.className = 'NoImage';
        this.dom.innerHTML = '暂无图片';
    }
    this.parent.appendChild(this.dom);
    this.dom.addEventListener('click', this.onClick.bind(this));
    this.input.value = null;
};

ImageUploader.prototype.onClick = function () {
    this.input.click();
};

ImageUploader.prototype.getValue = function () {
    return this.url;
};

ImageUploader.prototype.setValue = function (url) {
    this.url = url;
    this.render();
};

ImageUploader.prototype.onChange = function () {
    UploadUtils.upload(`file_${this.id}`, `${this.server}/api/Upload/Upload`, event => {
        if (event.target.status === 200) {
            var response = event.target.response;
            var obj = JSON.parse(response);
            var url = obj.Data.url;
            this.setValue(url);
        } else {
            UI.msg('图片上传失败！');
        }
    }, () => {
        UI.msg('图片上传失败！');
    });
};

UI.addXType('imageuploader', ImageUploader);

export default ImageUploader;