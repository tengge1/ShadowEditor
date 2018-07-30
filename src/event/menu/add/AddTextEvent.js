import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加文本事件
 * @param {*} app 
 */
function AddTextEvent(app) {
    MenuEvent.call(this, app);
}

AddTextEvent.prototype = Object.create(MenuEvent.prototype);
AddTextEvent.prototype.constructor = AddTextEvent;

AddTextEvent.prototype.start = function () {
    this.app.on(`mAddText.${this.id}`, this.onAddText.bind(this));
};

AddTextEvent.prototype.stop = function () {
    this.app.on(`mAddText.${this.id}`, null);
};

AddTextEvent.prototype.onAddText = function () {

};

export default AddTextEvent;