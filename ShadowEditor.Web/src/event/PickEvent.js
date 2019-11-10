import BaseEvent from './BaseEvent';

/**
 * 选取事件
 * @author tengge / https://github.com/tengge1
 */
function PickEvent() {
    BaseEvent.call(this);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.onDownPosition = new THREE.Vector2();
    this.onUpPosition = new THREE.Vector2();
    this.onDoubleClickPosition = new THREE.Vector2();

    this.onAppStarted = this.onAppStarted.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
}

PickEvent.prototype = Object.create(BaseEvent.prototype);
PickEvent.prototype.constructor = PickEvent;

PickEvent.prototype.start = function () {
    app.on(`appStarted.${this.id}`, this.onAppStarted);
};

PickEvent.prototype.onAppStarted = function () {
    app.viewport.addEventListener('mousedown', this.onMouseDown, false);
    app.viewport.addEventListener('dblclick', this.onDoubleClick, false);
};

PickEvent.prototype.onMouseDown = function (event) {
    if (event.button !== 0) { // 只允许左键选中
        return;
    }

    // 这样处理选中的原因是避免把拖动误认为点击
    event.preventDefault();

    let array = this.getMousePosition(app.viewport, event.clientX, event.clientY);
    this.onDownPosition.fromArray(array);

    document.addEventListener('mouseup', this.onMouseUp, false);
};

PickEvent.prototype.onMouseUp = function (event) {
    let array = this.getMousePosition(app.viewport, event.clientX, event.clientY);
    this.onUpPosition.fromArray(array);

    this.handleClick();

    document.removeEventListener('mouseup', this.onMouseUp, false);
};

PickEvent.prototype.onDoubleClick = function (event) {
    let objects = app.editor.objects;

    let array = this.getMousePosition(app.viewport, event.clientX, event.clientY);
    this.onDoubleClickPosition.fromArray(array);

    let intersects = this.getIntersects(this.onDoubleClickPosition, objects);

    if (intersects.length > 0) {
        let intersect = intersects[0];
        app.call('objectFocused', this, intersect.object);
    }
};

PickEvent.prototype.getIntersects = function (point, objects) {
    this.mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
    this.raycaster.setFromCamera(this.mouse, app.editor.view === 'perspective' ? app.editor.camera : app.editor.orthCamera);
    return this.raycaster.intersectObjects(objects);
};

PickEvent.prototype.getMousePosition = function (dom, x, y) {
    let rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};

PickEvent.prototype.handleClick = function () {
    let editor = app.editor;
    let objects = editor.objects;

    if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) {
        let intersects = this.getIntersects(this.onUpPosition, objects);

        if (intersects.length > 0) {
            let object = intersects[0].object;

            if (object.userData.object !== undefined) {
                // helper
                // TODO: userData上有object时，无法复制模型。
                editor.select(object.userData.object);
            } else if (app.options.selectMode === 'whole') { // 选择整体
                editor.select(this.partToMesh(object));
            } else if (app.options.selectMode === 'part') { // 选择部分
                editor.select(object);
            }
        } else {
            editor.select(null);
        }

        // objects in sceneHelpers
        let sceneHelpers = app.editor.sceneHelpers;

        intersects = this.getIntersects(this.onUpPosition, sceneHelpers.children);
        if (intersects.length > 0) {
            if (!(intersects[0].object instanceof THREE.GridHelper)) { // 禁止选中网格
                editor.select(intersects[0].object);
            }
        }
    }
};

/**
 * 如果选中的是模型的一部分，改为选择整个模型
 * @param {*} obj 通过模型的一部分获取整个模型
 * @returns {*} 整体模型
 */
PickEvent.prototype.partToMesh = function (obj) {
    let scene = app.editor.scene;

    if (obj === scene || obj.userData && obj.userData.Server === true) { // 场景或服务端模型
        return obj;
    }

    // 判断obj是否是模型的一部分
    let model = obj;
    let isPart = false;

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