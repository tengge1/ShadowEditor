/**
 * 组
 */
function Group() {
    THREE.Group.call(this);
    this.name = _t('Group');
}

Group.prototype = Object.create(THREE.Group.prototype);
Group.prototype.constructor = Group;

export default Group;