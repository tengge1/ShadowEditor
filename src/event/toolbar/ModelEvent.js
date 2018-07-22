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
    if (this.window == null) {
        this.window = new ModelWindow({ parent: this.app.container, app: this.app });
        this.window.render();
    }
    this.window.show();
};

ModelEvent.prototype.stop = function () {
    if (this.window) {
        this.window.hide();
    }
};

export default ModelEvent;