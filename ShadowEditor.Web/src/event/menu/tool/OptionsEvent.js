import MenuEvent from '../MenuEvent';
import OptionsWindow from '../../../editor/window/OptionsWindow';

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
    this.app.on('mOptions.' + this.id, this.onOptions.bind(this));
};

OptionsEvent.prototype.stop = function () {
    this.app.on('mOptions.' + this.id, null);
};

OptionsEvent.prototype.onOptions = function () {
    if (this.window === undefined) {
        this.window = new OptionsWindow({ app: this.app });
        this.window.render();
    }
    this.window.show();
};

export default OptionsEvent;