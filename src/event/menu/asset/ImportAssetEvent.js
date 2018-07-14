import MenuEvent from '../MenuEvent';

/**
 * 导入资源事件
 * @param {*} app 
 */
function ImportAssetEvent(app) {
    MenuEvent.call(this, app);
}

ImportAssetEvent.prototype = Object.create(MenuEvent.prototype);
ImportAssetEvent.prototype.constructor = ImportAssetEvent;

ImportAssetEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mImportAsset.' + this.id, function () {
        _this.onImportAsset();
    });

    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';

    var _this = this;
    this.fileInput.addEventListener('change', function (event) {
        if (_this.fileInput.files.length > 0) {
            _this.app.editor.loader.loadFile(_this.fileInput.files[0]);
        }
    });
};

ImportAssetEvent.prototype.stop = function () {
    this.app.on('mImportAsset.' + this.id, null);
};

ImportAssetEvent.prototype.onImportAsset = function () {
    this.fileInput.click();
};

export default ImportAssetEvent;