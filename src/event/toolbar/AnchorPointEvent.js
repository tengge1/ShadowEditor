import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

/**
 * 锚点事件
 * @param {*} app 
 */
function AnchorPointEvent(app) {
    BaseEvent.call(this, app);
}

AnchorPointEvent.prototype = Object.create(BaseEvent.prototype);
AnchorPointEvent.prototype.constructor = AnchorPointEvent;

AnchorPointEvent.prototype.start = function () {

};

AnchorPointEvent.prototype.stop = function () {

};

export default AnchorPointEvent;