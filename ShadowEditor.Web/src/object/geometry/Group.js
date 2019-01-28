/**
 * 组
 */
function Group() {
    THREE.Object3D.call(this);
    this.name = L_GROUP;
}

Group.prototype = Object.create(THREE.Object3D.prototype);
Group.prototype.constructor = Group;

export default Group;