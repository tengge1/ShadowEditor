import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';
import ModelWindow from '../../editor/window/ModelWindow';

/**
 * 模型事件
 * @param {*} app 
 */
function ModelEvent(app) {
    BaseEvent.call(this, app);
}

ModelEvent.prototype = Object.create(BaseEvent.prototype);
ModelEvent.prototype.constructor = ModelEvent;

ModelEvent.prototype.start = function () {
    var btn = UI.get('modelBtn');
    btn.dom.addEventListener('click', this.onClick.bind(this));
};

ModelEvent.prototype.stop = function () {
    var btn = UI.get('modelBtn');
    btn.dom.removeEventListener('click', this.onClick);
};

ModelEvent.prototype.onClick = function () {
    if (this.window == null) {
        this.window = new ModelWindow({ parent: this.app.container, app: this.app });
        this.window.render();
    }
    this.window.show();
};

export default ModelEvent;