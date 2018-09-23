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
 * 获取动画
 */
AnimationManager.prototype.getAnimations = function () {
    return this.animations;
};

/**
 * 设置动画
 * @param {*} animations 
 */
AnimationManager.prototype.setAnimations = function (animations) {
    this.animations = animations;
};

export default AnimationManager;