import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

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

};

ModelEvent.prototype.stop = function () {

};

export default ModelEvent;