import MenuEvent from '../MenuEvent';

/**
 * 关于事件
 * @param {*} app 
 */
function AboutEvent(app) {
    MenuEvent.call(this, app);
}

AboutEvent.prototype = Object.create(MenuEvent.prototype);
AboutEvent.prototype.constructor = AboutEvent;

AboutEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAbout.' + this.id, function () {
        _this.onAbout();
    });
};

AboutEvent.prototype.stop = function () {
    this.app.on('mAbout.' + this.id, null);
};

AboutEvent.prototype.onAbout = function () {
    window.open('http://threejs.org', '_blank');
};

export default AboutEvent;