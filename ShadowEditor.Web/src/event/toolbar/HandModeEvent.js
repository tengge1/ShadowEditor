import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 手型模式事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function HandModeEvent(app) {
    BaseEvent.call(this, app);
}

HandModeEvent.prototype = Object.create(BaseEvent.prototype);
HandModeEvent.prototype.constructor = HandModeEvent;

HandModeEvent.prototype.start = function () {

};

HandModeEvent.prototype.stop = function () {

};

export default HandModeEvent;