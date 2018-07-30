import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 从文件中打开场景事件
 * @param {*} app 
 */
function LoadFromHashEvent(app) {
    BaseEvent.call(this, app);
}

LoadFromHashEvent.prototype = Object.create(BaseEvent.prototype);
LoadFromHashEvent.prototype.constructor = LoadFromHashEvent;

LoadFromHashEvent.prototype.start = function () {
    var hash = window.location.hash;
    var editor = this.app.editor;

    if (hash.substr(1, 5) === 'file=') {

        var file = hash.substr(6);

        UI.confirm('询问', '未保存场景数据将丢失。确定打开文件？', function (event, btn) {
            if (btn === 'ok') {
                var loader = new THREE.FileLoader();
                loader.crossOrigin = '';

                loader.load(file, function (text) {
                    editor.clear();
                    editor.fromJSON(JSON.parse(text));
                });

                this.app.isLoadingFromHash = true;
            }
        });

    }
};

LoadFromHashEvent.prototype.stop = function () {

};

export default LoadFromHashEvent;