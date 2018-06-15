import BaseEvent from '../BaseEvent';
import RemoveObjectCommand from '../../command/RemoveObjectCommand';

/**
 * 键盘按键事件
 * @param {*} app 
 */
function KeyDownEvent(app) {
    BaseEvent.call(this, app);
}

KeyDownEvent.prototype = Object.create(BaseEvent.prototype);
KeyDownEvent.prototype.constructor = KeyDownEvent;

KeyDownEvent.prototype.start = function () {
    var _this = this;
    this.app.on('keydown.' + this.id, function (event) {
        _this.onKeyDown(event);
    });
};

KeyDownEvent.prototype.stop = function () {
    this.app.on('keydown.' + this.id, null);
};

KeyDownEvent.prototype.onKeyDown = function (event) {

    var editor = this.app.editor;

    switch (event.keyCode) {

        case 8: // backspace

            event.preventDefault(); // prevent browser back

        case 46: // delete

            var object = editor.selected;

            if (confirm('Delete ' + object.name + '?') === false) return;

            var parent = object.parent;
            if (parent !== null) editor.execute(new RemoveObjectCommand(object));

            break;

        case 90: // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

            if (event.ctrlKey && event.shiftKey) {

                editor.redo();

            } else if (event.ctrlKey) {

                editor.undo();

            }

            break;

        case 87: // Register W for translation transform mode

            editor.signals.transformModeChanged.dispatch('translate');

            break;

        case 69: // Register E for rotation transform mode

            editor.signals.transformModeChanged.dispatch('rotate');

            break;

        case 82: // Register R for scaling transform mode

            editor.signals.transformModeChanged.dispatch('scale');

            break;

    }
};

export default KeyDownEvent;