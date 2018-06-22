import MenuEvent from '../MenuEvent';

/**
 * 示例事件
 * @param {*} app 
 */
function ExampleEvent(app) {
    MenuEvent.call(this, app);
    this.isPlaying = false;
}

ExampleEvent.prototype = Object.create(MenuEvent.prototype);
ExampleEvent.prototype.constructor = ExampleEvent;

ExampleEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mArkanoid.' + this.id, function () {
        _this.onExample('arkanoid.app.json');
    });
    this.app.on('mCamera.' + this.id, function () {
        _this.onExample('camera.app.json');
    });
    this.app.on('mParticles.' + this.id, function () {
        _this.onExample('particles.app.json');
    });
    this.app.on('mPong.' + this.id, function () {
        _this.onExample('pong.app.json');
    });
};

ExampleEvent.prototype.stop = function () {
    this.app.on('mArkanoid.' + this.id, null);
    this.app.on('mCamera.' + this.id, null);
    this.app.on('mParticles.' + this.id, null);
    this.app.on('mPong.' + this.id, null);
};

ExampleEvent.prototype.onExample = function (name) {
    var editor = this.app.editor;

    if (confirm('任何未保存数据将丢失。确定吗？')) {
        var loader = new THREE.FileLoader();

        loader.load('examples/' + name, function (text) {
            editor.clear();
            editor.fromJSON(JSON.parse(text));
        });
    }
};

export default ExampleEvent;