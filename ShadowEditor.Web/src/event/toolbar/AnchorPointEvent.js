import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 锚点事件
 * @author tengge / https://github.com/tengge1
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