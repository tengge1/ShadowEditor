import BaseEvent from '../BaseEvent';

/**
 * 网格设置改变事件
 * @param {*} app 
 */
function GridChangeEvent(app) {
    BaseEvent.call(this, app);
}

GridChangeEvent.prototype = Object.create(BaseEvent.prototype);
GridChangeEvent.prototype.constructor = GridChangeEvent;

GridChangeEvent.prototype.start = function () {
    var _this = this;
    this.app.on('gridChange.' + this.id, function () {
        _this.onGridChange(this);
    });
};

GridChangeEvent.prototype.stop = function () {
    this.app.on('gridChange.' + this.id, null);
};

GridChangeEvent.prototype.onGridChange = function (statusBar) {
    var grid = statusBar.grid;
    var snap = statusBar.snap;
    var local = statusBar.local;
    var showGrid = statusBar.showGrid;

    this.app.call('snapChanged', this, snap.getValue() === true ? grid.getValue() : null);
    this.app.call('spaceChanged', this, local.getValue() === true ? 'local' : 'world');
};

export default GridChangeEvent;