import BaseEvent from '../BaseEvent';

/**
 * 平移旋转缩放改变事件
 * @param {*} app 
 */
function TransformModeChangedEvent(app) {
    BaseEvent.call(this, app);
}

TransformModeChangedEvent.prototype = Object.create(BaseEvent.prototype);
TransformModeChangedEvent.prototype.constructor = TransformModeChangedEvent;

TransformModeChangedEvent.prototype.start = function () {
    var _this = this;
    this.app.on('transformModeChanged.' + this.id, function (mode) {
        _this.onTransformModeChanged(mode);
    });
};

TransformModeChangedEvent.prototype.stop = function () {
    this.app.on('transformModeChanged.' + this.id, null);
};

TransformModeChangedEvent.prototype.onTransformModeChanged = function (mode) {
    var translateBtn = document.getElementById('translateBtn');
    var rotateBtn = document.getElementById('rotateBtn');
    var scaleBtn = document.getElementById('scaleBtn');

    translateBtn.classList.remove('selected');
    rotateBtn.classList.remove('selected');
    scaleBtn.classList.remove('selected');

    switch (mode) {
        case 'translate':
            translateBtn.classList.add('selected');
            break;
        case 'rotate':
            rotateBtn.classList.add('selected');
            break;
        case 'scale':
            scaleBtn.classList.add('selected');
            break;
    }
};

export default TransformModeChangedEvent;