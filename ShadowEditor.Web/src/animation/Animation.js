import AnimationType from './AnimationType';

var ID = -1;

/**
 * 动画数据
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 */
function Animation(options) {
    options = options || {};
    this.id = options.id || null; // MongoDB _id字段
    this.uuid = options.uuid || THREE.Math.generateUUID(); // uuid
    this.name = options.name || `动画${ID--}`; // 动画名称
    this.type = options.type || AnimationType.Tween; // 动画类型
    this.startTime = options.startTime || 0; // 开始时间（秒）
    this.endTime = options.endTime || 10; // 结束时间（秒）
}

export default Animation;