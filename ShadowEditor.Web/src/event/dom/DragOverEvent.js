import BaseEvent from '../BaseEvent';

/**
 * 拖动事件
 * @param {*} app 
 */
function DragOverEvent(app) {
    BaseEvent.call(this, app);
}

DragOverEvent.prototype = Object.create(BaseEvent.prototype);
DragOverEvent.prototype.constructor = DragOverEvent;

DragOverEvent.prototype.start = function () {
    var _this = this;
    this.app.on('dragover.' + this.id, function (event) {
        _this.onDragOver(event);
    });
};

DragOverEvent.prototype.stop = function () {
    this.app.on('dragover.' + this.id, null);
};

DragOverEvent.prototype.onDragOver = function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
};

export default DragOverEvent;