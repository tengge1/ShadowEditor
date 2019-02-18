/**
 * 组
 */
function Group() {
    THREE.Group.call(this);
    this.name = L_GROUP;
}

Group.prototype = Object.create(THREE.Group.prototype);
Group.prototype.constructor = Group;

export default Group;