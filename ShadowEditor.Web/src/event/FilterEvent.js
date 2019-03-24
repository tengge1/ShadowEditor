import BaseEvent from './BaseEvent';
import CssUtils from '../utils/CssUtils';

/**
 * 滤镜事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function FilterEvent(app) {
    BaseEvent.call(this, app);
}

FilterEvent.prototype = Object.create(BaseEvent.prototype);
FilterEvent.prototype.constructor = FilterEvent;

FilterEvent.prototype.start = function () {
    this.app.on(`editorCleared.${this.id}`, this.onEditorCleared.bind(this));
    this.app.on(`optionsChanged.${this.id}`, this.onOptionsChanged.bind(this));
};

FilterEvent.prototype.stop = function () {
    this.app.on(`editorCleared.${this.id}`, null);
    this.app.on(`optionsChanged.${this.id}`, null);
};

FilterEvent.prototype.onEditorCleared = function () {
    this.app.editor.renderer.domElement.style.filter = '';
};

FilterEvent.prototype.onOptionsChanged = function (options) {
    this.app.editor.renderer.domElement.style.filter = CssUtils.serializeFilter(options);
};

export default FilterEvent;