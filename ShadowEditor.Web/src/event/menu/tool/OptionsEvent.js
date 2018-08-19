import MenuEvent from '../MenuEvent';

/**
 * 选项菜单事件
 * @param {*} app 
 */
function OptionsEvent(app) {
    MenuEvent.call(this, app);
}

OptionsEvent.prototype = Object.create(MenuEvent.prototype);
OptionsEvent.prototype.constructor = OptionsEvent;

OptionsEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAbout.' + this.id, function () {
        _this.onAbout();
    });
};

OptionsEvent.prototype.stop = function () {
    this.app.on('mAbout.' + this.id, null);
};

OptionsEvent.prototype.onAbout = function () {
    window.open('http://threejs.org', '_blank');
};

export default OptionsEvent;