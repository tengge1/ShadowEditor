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

    var _this = this;
    this.app.on('geometryChanged.' + this.id, function () {
        _this.SaveState();
    });
    this.app.on('objectAdded.' + this.id, function () {
        _this.SaveState();
    });
    this.app.on('objectChanged.' + this.id, function () {
        _this.SaveState();
    });
    this.app.on('objectRemoved.' + this.id, function () {
        _this.SaveState();
    });
    signals.materialChanged.add(function () {
        _this.SaveState();
    });
    this.app.on('sceneBackgroundChanged.' + this.id, function () {
        _this.SaveState();
    });
    this.app.on('sceneFogChanged.' + this.id, function () {
        _this.SaveState();
    });
    this.app.on('sceneGraphChanged.' + this.id, function () {
        _this.SaveState();
    });
    signals.scriptChanged.add(function () {
        _this.SaveState();
    });
    signals.historyChanged.add(function () {
        _this.SaveState();
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
        _this.app.call('savingStarted', _this);

        _this.timeout = setTimeout(function () {
            editor.storage.set(editor.toJSON());
            _this.app.call('savingFinished', _this);
        }, 100);

    }, 1000);
};

export default AutoSaveEvent;