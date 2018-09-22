import Animation from './Animation';

var ID = 1;

/**
 * 动画组
 * @param {*} options 选项
 */
function AnimationGroup(options) {
    options = options || {};
    this.name = options.name || `组-${ID++}`; // 组名
    this.type = 'AnimationGroup'; // 组类型
    this.index = options.index || ID; // 组序号
    this.animations = options.animations || []; // 组动画
}

/**
 * 添加
 * @param {*} animation 
 */
AnimationGroup.prototype.add = function (animation) {
    this.insert(animation, this.animations.length - 1);
};

/**
 * 插入
 * @param {*} animation 
 * @param {*} index 
 */
AnimationGroup.prototype.insert = function (animation, index = 0) {
    if (!(animation instanceof Animation)) {
        console.warn(`AnimationGroup: animation不是Animation的实例。`);
        return;
    }
    this.animations.splice(index, 0, animation);
};

/**
 * 移除
 * @param {*} animation 
 */
AnimationGroup.prototype.remove = function (animation) {
    var index = this.animations.indexOf(animation);
    this.removeAt(index);
};

/**
 * 移除
 * @param {*} index 
 */
Animation.prototype.removeAt = function (index) {
    this.animations.splice(index, 1);
};

export default AnimationGroup;