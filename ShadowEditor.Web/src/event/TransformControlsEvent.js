import BaseEvent from './BaseEvent';
import SetPositionCommand from './../command/SetPositionCommand';
import SetRotationCommand from './../command/SetRotationCommand';
import SetScaleCommand from './../command/SetScaleCommand';

/**
 * 平移旋转缩放控件事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function TransformControlsEvent(app) {
    BaseEvent.call(this, app);

    this.mode = 'translate';

    this.objectPosition = null;
    this.objectRotation = null;
    this.objectScale = null;
}

TransformControlsEvent.prototype = Object.create(BaseEvent.prototype);
TransformControlsEvent.prototype.constructor = TransformControlsEvent;

TransformControlsEvent.prototype.start = function () {
    app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
};

TransformControlsEvent.prototype.onAppStarted = function () {
    var transformControls = app.editor.transformControls;

    transformControls.addEventListener('change', this.onChange.bind(this));
    transformControls.addEventListener('mouseDown', this.onMouseDown.bind(this));
    transformControls.addEventListener('mouseUp', this.onMouseUp.bind(this));

    app.on('objectSelected.' + this.id, this.onObjectSelected.bind(this));
    app.on('changeMode.' + this.id, this.onChangeMode.bind(this));
    app.on('snapChanged.' + this.id, this.onSnapChanged.bind(this));
    app.on('spaceChanged.' + this.id, this.onSpaceChanged.bind(this));
};

/**
 * 控件发生改变，需要更新包围盒位置，重绘场景
 */
TransformControlsEvent.prototype.onChange = function () {
    var editor = app.editor;
    var object = editor.transformControls.object;

    if (object) {
        app.call('objectChanged', this, object);
    }
};

/**
 * 点击鼠标，记录选中物体当前平移、旋转和缩放值
 */
TransformControlsEvent.prototype.onMouseDown = function () {
    if (app.editor.view !== 'perspective') {
        return;
    }

    if (['translate', 'rotate', 'scale'].indexOf(this.mode) === -1) {
        return;
    }

    var object = app.editor.transformControls.object;

    this.objectPosition = object.position.clone();
    this.objectRotation = object.rotation.clone();
    this.objectScale = object.scale.clone();

    app.editor.controls.enabled = false; // EditorControls
};

/**
 * 抬起鼠标，更新选中物体的平移、旋转和缩放值
 */
TransformControlsEvent.prototype.onMouseUp = function () {
    if (app.editor.view !== 'perspective') {
        return;
    }

    if (['translate', 'rotate', 'scale'].indexOf(this.mode) === -1) {
        return;
    }

    var editor = app.editor;
    var transformControls = editor.transformControls;
    var object = transformControls.object;

    if (object == null) {
        return;
    }

    switch (transformControls.getMode()) {
        case 'translate':
            if (!this.objectPosition.equals(object.position)) {
                editor.execute(new SetPositionCommand(object, object.position, this.objectPosition));
            }
            break;
        case 'rotate':
            if (!this.objectRotation.equals(object.rotation)) {
                editor.execute(new SetRotationCommand(object, object.rotation, this.objectRotation));
            }
            break;
        case 'scale':
            if (!this.objectScale.equals(object.scale)) {
                editor.execute(new SetScaleCommand(object, object.scale, this.objectScale));
            }
            break;
    }

    app.editor.controls.enabled = true; // EditorControls
};

/**
 * 物体已经选中
 * @param {*} object 选中的物体
 */
TransformControlsEvent.prototype.onObjectSelected = function (object) {
    app.editor.transformControls.detach();

    if (['translate', 'rotate', 'scale'].indexOf(this.mode) === -1) {
        return;
    }

    if (!object || object === app.editor.scene || object === app.editor.camera) {
        return;
    }

    app.editor.transformControls.attach(object);
};

/**
 * 切换平移、旋转、缩放模式
 * @param {*} mode 模式
 */
TransformControlsEvent.prototype.onChangeMode = function (mode) {
    this.mode = mode;
    var transformControls = app.editor.transformControls;

    if (mode === 'translate' || mode === 'rotate' || mode === 'scale') { // 设置模式在选中物体上
        transformControls.setMode(mode);
        var object = app.editor.selected;
        if (object != null) {
            transformControls.attach(object);
        }
    } else { // 取消对选中物体平移、旋转、缩放
        transformControls.detach();
    }
};

/**
 * 设置平移移动的大小
 * @param {*} dist 
 */
TransformControlsEvent.prototype.onSnapChanged = function (dist) {
    app.editor.transformControls.setTranslationSnap(dist);
};

/**
 * 设置世界坐标系还是物体坐标系
 * @param {*} space 
 */
TransformControlsEvent.prototype.onSpaceChanged = function (space) {
    app.editor.transformControls.setSpace(space);
};

export default TransformControlsEvent;