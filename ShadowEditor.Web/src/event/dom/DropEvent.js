import BaseEvent from '../BaseEvent';

/**
 * 放置事件
 * @param {*} app 
 */
function DropEvent(app) {
    BaseEvent.call(this, app);
}

DropEvent.prototype = Object.create(BaseEvent.prototype);
DropEvent.prototype.constructor = DropEvent;

DropEvent.prototype.start = function () {
    var _this = this;
    this.app.on('drop.' + this.id, function (event) {
        _this.onDrop(event);
    });
};

DropEvent.prototype.stop = function () {
    this.app.on('drop.' + this.id, null);
};

DropEvent.prototype.onDrop = function (event) {
    var editor = this.app.editor

    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {

        editor.loader.loadFile(event.dataTransfer.files[0]);

    }
};

export default DropEvent;