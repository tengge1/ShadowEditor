import BaseEvent from './BaseEvent';
import EffectRenderer from '../render/EffectRenderer';

/**
 * 光线投射事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function RaycastEvent(app) {
    BaseEvent.call(this, app);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
}

RaycastEvent.prototype = Object.create(BaseEvent.prototype);
RaycastEvent.prototype.constructor = RaycastEvent;

RaycastEvent.prototype.start = function () {
    this.app.on(`mousedown.${this.id}`, this.onMouseDown.bind(this));
    this.app.on(`mouseup.${this.id}`, this.onMouseUp.bind(this));
};

RaycastEvent.prototype.stop = function () {
    this.app.on(`mousedown.${this.id}`, null);
    this.app.on(`mouseup.${this.id}`, null);
};

RaycastEvent.prototype.onMouseDown = function (event) {
    if (event.target !== this.app.editor.renderer.domElement) {
        return;
    }

    this.isDown = true;
    this.x = event.offsetX;
    this.y = event.offsetY;
};

RaycastEvent.prototype.onMouseUp = function (event) {
    if (event.target !== this.app.editor.renderer.domElement) {
        return;
    }

    if (!this.isDown || this.x !== event.offsetX || this.y !== event.offsetY) {
        return;
    }

    var domElement = this.app.editor.renderer.domElement;

    this.mouse.x = event.offsetX / domElement.clientWidth * 2 - 1;
    this.mouse.y = -event.offsetY / domElement.clientHeight * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.app.editor.camera);

    var intersects = this.raycaster.intersectObjects(this.app.editor.scene.children, false);

    if (intersects.length > 0) {
        this.app.call('raycaster', this, intersects[0], intersects);
    }
};

export default RaycastEvent;