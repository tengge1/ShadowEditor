import BaseEvent from './BaseEvent';

/**
 * 选取事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PickEvent(app) {
    BaseEvent.call(this, app);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.onDownPosition = new THREE.Vector2();
    this.onUpPosition = new THREE.Vector2();
    this.onDoubleClickPosition = new THREE.Vector2();
}

PickEvent.prototype = Object.create(BaseEvent.prototype);
PickEvent.prototype.constructor = PickEvent;

PickEvent.prototype.start = function () {
    var viewport = app.viewport;

    viewport.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    viewport.addEventListener('dblclick', this.onDoubleClick.bind(this), false);
};

PickEvent.prototype.stop = function () {
    var viewport = app.viewport;

    viewport.removeEventListener('mousedown', this.onMouseDown, false);
    viewport.removeEventListener('dblclick', this.onDoubleClick, false);
};

PickEvent.prototype.onMouseDown = function (event) {
    if (event.button !== 0) { // 只允许左键选中
        return;
    }

    // 这样处理选中的原因是避免把拖动误认为点击
    event.preventDefault();

    var array = this.getMousePosition(app.viewport, event.clientX, event.clientY);
    this.onDownPosition.fromArray(array);

    document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
};

PickEvent.prototype.onMouseUp = function (event) {
    var array = this.getMousePosition(app.viewport, event.clientX, event.clientY);
    this.onUpPosition.fromArray(array);

    this.handleClick();

    document.removeEventListener('mouseup', this.onMouseUp, false);
};

PickEvent.prototype.onDoubleClick = function (event) {
    var objects = app.editor.objects;

    var array = this.getMousePosition(app.viewport, event.clientX, event.clientY);
    this.onDoubleClickPosition.fromArray(array);

    var intersects = this.getIntersects(this.onDoubleClickPosition, objects);

    if (intersects.length > 0) {
        var intersect = intersects[0];
        app.call('objectFocused', this, intersect.object);
    }
};

PickEvent.prototype.getIntersects = function (point, objects) {
    this.mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);
    this.raycaster.setFromCamera(this.mouse, app.editor.camera);
    return this.raycaster.intersectObjects(objects);
};

PickEvent.prototype.getMousePosition = function (dom, x, y) {
    var rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};

PickEvent.prototype.handleClick = function () {
    var editor = app.editor;
    var objects = editor.objects;

    if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) {
        var intersects = this.getIntersects(this.onUpPosition, objects);

        if (intersects.length > 0) {
            var object = intersects[0].object;

            if (object.userData.object !== undefined) {
                // helper
                editor.select(object.userData.object);
            } else {
                editor.select(this.partToMesh(object));
            }
        } else {
            editor.select(null);
        }

        // objects in sceneHelpers
        var sceneHelpers = app.editor.sceneHelpers;

        var intersects = this.getIntersects(this.onUpPosition, sceneHelpers.children);
        if (intersects.length > 0) {
            if (!(intersects[0].object instanceof THREE.GridHelper)) { // 禁止选中网格
                editor.select(intersects[0].object);
            }
        }

        app.call('render');
    }
};

/**
 * 如果选中的是模型的一部分，改为选择整个模型
 * @param {*} obj 
 */
PickEvent.prototype.partToMesh = function (obj) {
    var scene = app.editor.scene;

    if (obj === scene || obj.userData && obj.userData.Server === true) { // 场景或服务端模型
        return obj;
    }

    // 判断obj是否是模型的一部分
    var model = obj;
    var isPart = false;

    while (model) {
        if (model === scene) {
            break;
        }
        if (model.userData && model.userData.Server === true) {
            isPart = true;
            break;
        }

        model = model.parent;
    }

    if (isPart) {
        return model;
    }

    return obj;
};

export default PickEvent;