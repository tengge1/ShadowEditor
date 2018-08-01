import BaseEvent from '../BaseEvent';

/**
 * 菜单事件
 * @param {*} app 
 */
function MenuEvent(app) {
    BaseEvent.call(this, app);
}

MenuEvent.prototype = Object.create(BaseEvent.prototype);
MenuEvent.prototype.constructor = MenuEvent;

MenuEvent.prototype.start = function () {

};

MenuEvent.prototype.stop = function () {

};

export default MenuEvent;