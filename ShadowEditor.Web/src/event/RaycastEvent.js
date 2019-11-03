import BaseEvent from './BaseEvent';

/**
 * 光线投射事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function RaycastEvent(app) {
    BaseEvent.call(this, app);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
}

RaycastEvent.prototype = Object.create(BaseEvent.prototype);
RaycastEvent.prototype.constructor = RaycastEvent;

RaycastEvent.prototype.start = function () {
    app.on(`mousedown.${this.id}`, this.onMouseDown.bind(this));
    app.on(`mouseup.${this.id}`, this.onMouseUp.bind(this));
};

RaycastEvent.prototype.stop = function () {
    app.on(`mousedown.${this.id}`, null);
    app.on(`mouseup.${this.id}`, null);
};

RaycastEvent.prototype.onMouseDown = function (event) {
    if (event.target !== app.editor.renderer.domElement) {
        return;
    }

    this.isDown = true;
    this.x = event.offsetX;
    this.y = event.offsetY;
};

RaycastEvent.prototype.onMouseUp = function (event) {
    if (event.target !== app.editor.renderer.domElement) {
        return;
    }

    if (!this.isDown || this.x !== event.offsetX || this.y !== event.offsetY) {
        return;
    }

    var domElement = app.editor.renderer.domElement;

    this.mouse.x = event.offsetX / domElement.clientWidth * 2 - 1;
    this.mouse.y = -event.offsetY / domElement.clientHeight * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, app.editor.camera);

    var intersects = this.raycaster.intersectObjects(app.editor.scene.children, true);

    if (intersects.length > 0) {
        app.call('raycast', this, intersects[0], event, intersects);
        app.editor.select(intersects[0].object);
    }
};

export default RaycastEvent;