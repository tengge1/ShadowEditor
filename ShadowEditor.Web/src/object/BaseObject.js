/**
 * 所有物体基类
 */
function BaseObject() {
    THREE.Object3D.call(this);
}

BaseObject.prototype = Object.create(THREE.Object3D.prototype);
BaseObject.prototype.constructor = BaseObject;

export default BaseObject;