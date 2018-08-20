import MenuEvent from '../MenuEvent';
import OptionsWindow from '../../../editor/window/OptionsWindow';

/**
 * 外观选项事件
 * @param {*} app 
 */
function SurfaceOptionsEvent(app) {
    MenuEvent.call(this, app);
}

SurfaceOptionsEvent.prototype = Object.create(MenuEvent.prototype);
SurfaceOptionsEvent.prototype.constructor = SurfaceOptionsEvent;

SurfaceOptionsEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mSurfaceOptions.' + this.id, this.onOptions.bind(this));
};

SurfaceOptionsEvent.prototype.stop = function () {
    this.app.on('mSurfaceOptions.' + this.id, null);
};

SurfaceOptionsEvent.prototype.onOptions = function () {
    var window = UI.get('optionsWindow');
    if (window == null) {
        window = new OptionsWindow({ app: this.app, id: 'optionsWindow' });
        window.render();
    }
    window.show();
    window.changeTab('外观');
};

export default SurfaceOptionsEvent;