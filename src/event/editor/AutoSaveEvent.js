import BaseEvent from '../BaseEvent';

/**
 * 自动保存事件
 * @param {*} app 
 */
function AutoSaveEvent(app) {
    BaseEvent.call(this, app);

    this.timeout = null;
}

AutoSaveEvent.prototype = Object.create(BaseEvent.prototype);
AutoSaveEvent.prototype.constructor = AutoSaveEvent;

AutoSaveEvent.prototype.start = function () {
    var signals = this.app.editor.signals;
    var modal = this.app.modal;

    var _this = this;
    signals.geometryChanged.add(function () {
        _this.SaveState();
    });
    signals.objectAdded.add(function () {
        _this.SaveState();
    });
    signals.objectChanged.add(function () {
        _this.SaveState();
    });
    signals.objectRemoved.add(function () {
        _this.SaveState();
    });
    signals.materialChanged.add(function () {
        _this.SaveState();
    });
    signals.sceneBackgroundChanged.add(function () {
        _this.SaveState();
    });
    signals.sceneFogChanged.add(function () {
        _this.SaveState();
    });
    signals.sceneGraphChanged.add(function () {
        _this.SaveState();
    });
    signals.scriptChanged.add(function () {
        _this.SaveState();
    });
    signals.historyChanged.add(function () {
        _this.SaveState();
    });
    signals.showModal.add(function (content) {
        modal.show(content);
    });
};

AutoSaveEvent.prototype.stop = function () {

};

AutoSaveEvent.prototype.SaveState = function () {
    var editor = this.app.editor;

    if (editor.config.getKey('autosave') === false) {
        return;
    }

    clearTimeout(this.timeout);

    var _this = this;

    this.timeout = setTimeout(function () {

        editor.signals.savingStarted.dispatch();

        _this.timeout = setTimeout(function () {

            editor.storage.set(editor.toJSON());

            editor.signals.savingFinished.dispatch();

        }, 100);

    }, 1000);
};

export default AutoSaveEvent;