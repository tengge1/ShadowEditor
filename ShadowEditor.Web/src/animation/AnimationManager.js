import AnimationGroup from './AnimationGroup';

/**
 * 动画管理器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function AnimationManager(app) {
    this.app = app;
    this.animations = [];
};

/**
 * 清空所有
 */
AnimationManager.prototype.clear = function () {
    this.animations = [];

    for (var i = 0; i < 3; i++) {
        var group = new AnimationGroup({
            name: `组${i + 1}`,
            index: i
        });
        this.animations.push(group);
    }
};

/**
 * 添加动画组
 * @param {*} group 动画组
 */
AnimationManager.prototype.add = function (group) {
    this.insert(group, this.animations.length);
};

/**
 * 插入动画组
 * @param {*} group 动画组
 * @param {*} index 索引
 */
AnimationManager.prototype.insert = function (group, index = 0) {
    if (!(group instanceof AnimationGroup)) {
        console.warn(`AnimationManager: group不是AnimationGroup的实例。`);
        return;
    }
    this.animations.splice(index, 0, group);
};

/**
 * 删除组
 * @param {*} group 动画组
 */
AnimationManager.prototype.remove = function (group) {
    var index = this.animations.indexOf(group);
    if (index > -1) {
        this.animations.splice(index, 1);
    }
};

/**
 * 根据uuid删除组
 * @param {*} uuid 
 */
AnimationManager.prototype.removeByUUID = function (uuid) {
    var index = this.animations.findIndex(n => n.uuid === uuid);
    if (index > -1) {
        this.animations.splice(index, 1);
    }
};

/**
 * 获取动画
 */
AnimationManager.prototype.getAnimationGroups = function () {
    return this.animations;
};

/**
 * 设置动画
 * @param {*} animations 
 */
AnimationManager.prototype.setAnimationGroups = function (animations) {
    this.animations = animations;
};

/**
 * 根据uuid获取动画
 * @param {*} uuid 
 */
AnimationManager.prototype.getAnimationByUUID = function (uuid) {
    var group = this.animations.filter(n => n.animations.findIndex(m => m.uuid === uuid) > -1)[0];
    if (group === undefined) {
        return null;
    }
    return group.animations.filter(n => n.uuid === uuid)[0];
};

export default AnimationManager;