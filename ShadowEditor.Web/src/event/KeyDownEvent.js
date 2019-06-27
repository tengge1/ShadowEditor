import BaseEvent from './BaseEvent';
import RemoveObjectCommand from '../command/RemoveObjectCommand';
import UI from '../ui/UI';

/**
 * 键盘按键事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function KeyDownEvent(app) {
    BaseEvent.call(this, app);
}

KeyDownEvent.prototype = Object.create(BaseEvent.prototype);
KeyDownEvent.prototype.constructor = KeyDownEvent;

KeyDownEvent.prototype.start = function () {
    app.on(`keydown.${this.id}`, this.onKeyDown.bind(this));
};

KeyDownEvent.prototype.stop = function () {
    app.on(`keydown.${this.id}`, null);
};

KeyDownEvent.prototype.onKeyDown = function (event) {
    var editor = app.editor;

    switch (event.keyCode) {
        case 8: // 回退键
            event.preventDefault(); // 阻止浏览器返回
            break;

        case 46: // 删除键
            var object = editor.selected;
            if (object == null) {
                return;
            }
            UI.confirm(L_CONFIRM, `${L_DELETE} ` + object.name + '?', function (event, btn) {
                if (btn === 'ok') {
                    var parent = object.parent;
                    if (parent !== null) editor.execute(new RemoveObjectCommand(object));
                }
            });
            break;

        case 90: // 注册Ctrl-Z撤销, Ctrl-Shift-Z重做
            if (event.ctrlKey && event.shiftKey) {
                editor.redo();
            } else if (event.ctrlKey) {
                editor.undo();
            }
            break;

        // TODO： 和第一人称控制器ASDW冲突
        // case 87: // 注册 W 移动模式
        //     app.call('changeMode', this, 'translate');
        //     break;

        // case 69: // 注册 E 旋转模式
        //     app.call('changeMode', this, 'rotate');
        //     break;

        // case 82: // 注册 R 缩放模式
        //     app.call('changeMode', this, 'scale');
        //     break;
    }
};

export default KeyDownEvent;