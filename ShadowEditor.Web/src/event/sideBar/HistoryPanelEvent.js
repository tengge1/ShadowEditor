import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 历史面板事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function HistoryPanelEvent(app) {
    BaseEvent.call(this, app);

    this.currentObject = null;
    this.copiedMaterial = null;
}

HistoryPanelEvent.prototype = Object.create(BaseEvent.prototype);
HistoryPanelEvent.prototype.constructor = HistoryPanelEvent;

HistoryPanelEvent.prototype.start = function () {
    this.app.on(`editorCleared.${this.id}`, this.refreshUI.bind(this));
    this.app.on(`historyChanged.${this.id}`, this.refreshUI.bind(this));
    this.refreshUI();
};

HistoryPanelEvent.prototype.stop = function () {
    this.app.on(`editorCleared.${this.id}`, null);
    this.app.on(`historyChanged.${this.id}`, null);
};

HistoryPanelEvent.prototype.refreshUI = function () {
    var editor = this.app.editor;
    var history = editor.history;
    var outliner = UI.get('historyOutlinear');

    var options = [];
    var enumerator = 1;

    function buildOption(object) {
        var option = document.createElement('div');
        option.value = object.id;
        return option;
    }

    (function addObjects(objects) {
        for (var i = 0, l = objects.length; i < l; i++) {
            var object = objects[i];
            var option = buildOption(object);
            option.innerHTML = '&nbsp;' + object.name;
            options.push(option);
        }
    })(history.undos);


    (function addObjects(objects, pad) {
        for (var i = objects.length - 1; i >= 0; i--) {
            var object = objects[i];
            var option = buildOption(object);
            option.innerHTML = '&nbsp;' + object.name;
            option.style.opacity = 0.3;
            options.push(option);
        }
    })(history.redos, '&nbsp;');

    outliner.setOptions(options);
};


export default HistoryPanelEvent;