import BaseEvent from '../BaseEvent';

/**
 * 主题改变事件
 * @param {*} app 
 */
function ThemeChangedEvent(app) {
    BaseEvent.call(this, app);
}

ThemeChangedEvent.prototype = Object.create(BaseEvent.prototype);
ThemeChangedEvent.prototype.constructor = ThemeChangedEvent;

ThemeChangedEvent.prototype.start = function () {
    this.app.on('themeChanged.' + this.id, this.onThemeChanged.bind(this));
};

ThemeChangedEvent.prototype.stop = function () {
    this.app.on('themeChanged.' + this.id, null);
};

ThemeChangedEvent.prototype.onThemeChanged = function (value) {
    var editor = this.app.editor;
    var sceneHelpers = editor.sceneHelpers;
    var grid = editor.grid;

    switch (value) {
        case 'assets/css/light.css':
            sceneHelpers.remove(grid);
            grid = new THREE.GridHelper(60, 60, 0x444444, 0x888888);
            sceneHelpers.add(grid);
            editor.grid = grid;
            break;
        case 'assets/css/dark.css':
            sceneHelpers.remove(grid);
            grid = new THREE.GridHelper(60, 60, 0xbbbbbb, 0x888888);
            sceneHelpers.add(grid);
            editor.grid = grid;
            break;
    }

    this.app.call('render');
};

export default ThemeChangedEvent;