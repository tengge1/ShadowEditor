import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 缩放模式事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ScaleModeEvent(app) {
    BaseEvent.call(this, app);
}

ScaleModeEvent.prototype = Object.create(BaseEvent.prototype);
ScaleModeEvent.prototype.constructor = ScaleModeEvent;

ScaleModeEvent.prototype.start = function () {
    var btn = UI.get('scaleBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

ScaleModeEvent.prototype.stop = function () {
    var btn = UI.get('scaleBtn');
    btn.dom.removeEventListener('click', this.onClick);
    this.app.on(`changeMode.${this.id}`, null);
};

ScaleModeEvent.prototype.onClick = function () {
    this.app.call('changeMode', this, 'scale');
};

ScaleModeEvent.prototype.onChangeMode = function (mode) {
    var btn = UI.get('scaleBtn');

    if (mode === 'scale') {
        btn.select();
    } else {
        btn.unselect();
    }
};

export default ScaleModeEvent;