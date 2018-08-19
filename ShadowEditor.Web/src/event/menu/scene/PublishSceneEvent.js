import MenuEvent from '../MenuEvent';
import MathUtils from '../../../utils/MathUtils';

/**
 * 发布场景
 * @param {*} app 
 */
function PublishSceneEvent(app) {
    MenuEvent.call(this, app);
}

PublishSceneEvent.prototype = Object.create(MenuEvent.prototype);
PublishSceneEvent.prototype.constructor = PublishSceneEvent;

PublishSceneEvent.prototype.start = function () {
    this.app.on(`mPublishScene.${this.id}`, this.onPublishScene.bind(this));

    this.link = document.createElement('a');
    this.link.style.display = 'none';
    document.body.appendChild(this.link); // Firefox workaround, see #6594
};

PublishSceneEvent.prototype.stop = function () {
    this.app.on(`mPublishScene.${this.id}`, null);
};

PublishSceneEvent.prototype.onPublishScene = function () {
    var editor = this.app.editor;

    var zip = new JSZip();
    //

    var output = editor.toJSON();
    output.metadata.type = 'App';
    delete output.history;

    output = JSON.stringify(output, MathUtils.parseNumber, '\t');
    output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

    zip.file('app.json', output);

    //

    var _this = this;
    var manager = new THREE.LoadingManager(function () {
        _this.save(zip.generate({ type: 'blob' }), 'download.zip');
    });

    var loader = new THREE.FileLoader(manager);
    loader.load('third_party/app/index.html', function (content) {
        var includes = [];

        content = content.replace('<!-- includes -->', includes.join('\n\t\t'));
        zip.file('index.html', content);
    });
    loader.load('third_party/app.js', function (content) {
        zip.file('js/app.js', content);
    });
    loader.load('node_modules/three/build/three.min.js', function (content) {
        zip.file('js/three.min.js', content);
    });
};

PublishSceneEvent.prototype.save = function (blob, filename) {
    this.link.href = URL.createObjectURL(blob);
    this.link.download = filename || 'data.json';
    this.link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...
};

PublishSceneEvent.prototype.saveString = function (text, filename) {
    this.save(new Blob([text], { type: 'text/plain' }), filename);
};

export default PublishSceneEvent;