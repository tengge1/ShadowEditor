import BaseEvent from '../BaseEvent';

/**
 * 显示隐藏网格事件
 * @param {*} app 
 */
function ShowGridChangedEvent(app) {
    BaseEvent.call(this, app);
}

ShowGridChangedEvent.prototype = Object.create(BaseEvent.prototype);
ShowGridChangedEvent.prototype.constructor = ShowGridChangedEvent;

ShowGridChangedEvent.prototype.start = function () {
    var _this = this;
    this.app.on('showGridChanged.' + this.id, function (showGrid) {
        _this.onShowGridChanged(showGrid);
    });
};

ShowGridChangedEvent.prototype.stop = function () {
    this.app.on('showGridChanged.' + this.id, null);
};

ShowGridChangedEvent.prototype.onShowGridChanged = function (showGrid) {
    var grid = this.app.editor.grid;

    grid.visible = showGrid;

    this.app.call('render');
};

export default ShowGridChangedEvent;