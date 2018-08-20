import MenuEvent from '../MenuEvent';
import OptionsWindow from '../../../editor/window/OptionsWindow';

/**
 * 渲染器选项事件
 * @param {*} app 
 */
function RendererOptionsEvent(app) {
    MenuEvent.call(this, app);
}

RendererOptionsEvent.prototype = Object.create(MenuEvent.prototype);
RendererOptionsEvent.prototype.constructor = RendererOptionsEvent;

RendererOptionsEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mRendererOptions.' + this.id, this.onOptions.bind(this));
};

RendererOptionsEvent.prototype.stop = function () {
    this.app.on('mRendererOptions.' + this.id, null);
};

RendererOptionsEvent.prototype.onOptions = function () {
    var window = UI.get('optionsWindow');
    if (window == null) {
        window = new OptionsWindow({ app: this.app, id: 'optionsWindow' });
        window.render();
    }
    window.show();
    window.changeTab('渲染器');
};

export default RendererOptionsEvent;