import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 场景面板事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ScenePanelEvent(app) {
    BaseEvent.call(this, app);
}

ScenePanelEvent.prototype = Object.create(BaseEvent.prototype);
ScenePanelEvent.prototype.constructor = ScenePanelEvent;

ScenePanelEvent.prototype.start = function () {
    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
    this.app.on(`editorCleared.${this.id}`, this.refreshUI.bind(this));
    this.app.on(`sceneGraphChanged.${this.id}`, this.refreshUI.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
};

ScenePanelEvent.prototype.stop = function () {
    this.app.on(`editorCleared.${this.id}`, null);
    this.app.on(`sceneGraphChanged.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
    this.app.on(`objectSelected.${this.id}`, null);
};

ScenePanelEvent.prototype.onAppStarted = function () {
    this.refreshUI();
};

/**
 * 场景物体改变
 * @param {*} object 
 */
ScenePanelEvent.prototype.onObjectChanged = function (object) {
    var outliner = UI.get('outliner');

    var options = outliner.options;

    for (var i = 0; i < options.length; i++) {
        var option = options[i];

        if (option.value === object.id) {
            option.innerHTML = this.buildHTML(object);
            return;
        }
    }
};

/**
 * 选中物体改变
 * @param {*} object 
 */
ScenePanelEvent.prototype.onObjectSelected = function (object) {
    var outliner = UI.get('outliner');
    outliner.setValue(object !== null ? object.id : null);
};

// outliner
ScenePanelEvent.prototype.buildOption = function (object, draggable) {
    var option = document.createElement('div');
    option.draggable = draggable;
    option.innerHTML = this.buildHTML(object);
    option.value = object.id;
    return option;
};

ScenePanelEvent.prototype.buildHTML = function (object) {
    var html = '<span class="type ' + object.type + '"></span> ' + object.name;

    if (object instanceof THREE.Mesh) {
        var geometry = object.geometry;
        var material = object.material;

        html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
        html += ' <span class="type ' + material.type + '"></span> ' + (material.name == null ? '' : material.name);
    }

    html += this.getScript(object.uuid);
    return html;
};

ScenePanelEvent.prototype.getScript = function (uuid) {
    var editor = this.app.editor;

    if (editor.scripts[uuid] !== undefined) {
        return ' <span class="type Script"></span>';
    }

    return '';
};

ScenePanelEvent.prototype.refreshUI = function () {
    var editor = this.app.editor;
    var camera = editor.camera;
    var scene = editor.scene;
    var outliner = UI.get('outliner');

    if(outliner.editor === undefined) {
        outliner.editor = editor;
    }

    var options = [];

    options.push(this.buildOption(camera, false));
    options.push(this.buildOption(scene, false));

    var _this = this;

    (function addObjects(objects, pad) {
        for (var i = 0, l = objects.length; i < l; i++) {
            var object = objects[i];

            var option = _this.buildOption(object, true);
            option.style.paddingLeft = (pad * 10) + 'px';
            options.push(option);

            addObjects(object.children, pad + 1);
        }
    })(scene.children, 1);

    outliner.setOptions(options);

    if (editor.selected !== null) {
        outliner.setValue(editor.selected.id);
    }
};

export default ScenePanelEvent;