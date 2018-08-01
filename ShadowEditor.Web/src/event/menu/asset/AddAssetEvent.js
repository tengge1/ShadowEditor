import MenuEvent from '../MenuEvent';

/**
 * 添加资源事件
 * @param {*} app 
 */
function AddAssetEvent(app) {
    MenuEvent.call(this, app);
}

AddAssetEvent.prototype = Object.create(MenuEvent.prototype);
AddAssetEvent.prototype.constructor = AddAssetEvent;

AddAssetEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddAsset.' + this.id, function () {
        _this.onAddAsset();
    });
};

AddAssetEvent.prototype.stop = function () {
    this.app.on('mAddAsset.' + this.id, null);
};

AddAssetEvent.prototype.onAddAsset = function () {
    var btn = UI.get('modelBtn');
    if (btn) {
        btn.dom.click();
    }
};

export default AddAssetEvent;