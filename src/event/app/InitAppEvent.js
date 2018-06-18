import BaseEvent from '../BaseEvent';

/**
 * 初始化应用程序事件
 * @param {*} app 
 */
function InitAppEvent(app) {
    BaseEvent.call(this, app);
}

InitAppEvent.prototype = Object.create(BaseEvent.prototype);
InitAppEvent.prototype.constructor = InitAppEvent;

InitAppEvent.prototype.start = function () {
    var _this = this;
    this.app.on('initApp.' + this.id, function () {
        _this.onInitApp();
    });
};

InitAppEvent.prototype.stop = function () {
    this.app.on('initApp.' + this.id, null);
};

InitAppEvent.prototype.onInitApp = function () {
    var app = this.app;
    var editor = app.editor;

    editor.setTheme(editor.config.getKey('theme'));

    editor.storage.init(function () {

        editor.storage.get(function (state) {

            // 从文件中读取场景时，如果读取缓存，会覆盖从文件中读取的场景，所以直接返回
            if (app.isLoadingFromHash) {
                return;
            };

            if (state !== undefined) {
                editor.fromJSON(state);
            }

            var selected = editor.config.getKey('selected');

            if (selected !== undefined) {
                editor.selectByUuid(selected);
            }

        });
    });
};

export default InitAppEvent;