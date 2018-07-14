import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

/**
 * 缩放模式事件
 * @param {*} app 
 */
function ScaleModeEvent(app) {
    BaseEvent.call(this, app);
}

ScaleModeEvent.prototype = Object.create(BaseEvent.prototype);
ScaleModeEvent.prototype.constructor = ScaleModeEvent;

ScaleModeEvent.prototype.start = function () {
    var btn = XType.getControl('scaleBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

ScaleModeEvent.prototype.stop = function () {
    var btn = XType.getControl('scaleBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

ScaleModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', 'this', 'scale');
};

ScaleModeEvent.prototype.onChangeMode = function (mode) {
    var btn = XType.getControl('scaleBtn');

    if (mode === 'scale') {
        btn.select();
    } else {
        btn.unselect();
    }

    this.app.call('transformModeChanged', this, 'scale');
};

export default ScaleModeEvent;