import AnimationType from './AnimationType';

var ID = -1;

/**
 * 动画数据
 * @author tengge / https://github.com/tengge1
 * @param {*} options 选项
 */
function Animation(options) {
    options = options || {};

    // 基本信息
    this.id = options.id || null; // MongoDB _id字段
    this.uuid = options.uuid || THREE.Math.generateUUID(); // uuid
    this.name = options.name || `动画${ID--}`; // 动画名称
    this.target = options.target || null; // 动画对象uuid
    this.type = options.type || AnimationType.Tween; // 动画类型
    this.startTime = options.startTime || 0; // 开始时间（秒）
    this.endTime = options.endTime || 10; // 结束时间（秒）

    // 补间动画
    this.beginStatus = options.beginStatus || 'Current'; // 开始状态（Current、Custom）
    this.beginPositionX = options.beginPositionX || 0;
    this.beginPositionY = options.beginPositionY || 0;
    this.beginPositionZ = options.beginPositionZ || 0;
    this.beginRotationX = options.beginRotationX || 0;
    this.beginRotationY = options.beginRotationY || 0;
    this.beginRotationZ = options.beginRotationZ || 0;
    this.beginScaleLock = options.beginScaleLock === undefined ? true : options.beginScaleLock;
    this.beginScaleX = options.beginScaleX || 1.0;
    this.beginScaleY = options.beginScaleY || 1.0;
    this.beginScaleZ = options.beginScaleZ || 1.0;
    this.ease = options.ease || 'linear'; // linear, quadIn, quadOut, quadInOut, cubicIn, cubicOut, cubicInOut, quartIn, quartOut, quartInOut, quintIn, quintOut, quintInOut, sineIn, sineOut, sineInOut, backIn, backOut, backInOut, circIn, circOut, circInOut, bounceIn, bounceOut, bounceInOut, elasticIn, elasticOut, elasticInOut
    this.endStatus = options.endStatus || 'Current';
    this.endPositionX = options.endPositionX || 0;
    this.endPositionY = options.endPositionY || 0;
    this.endPositionZ = options.endPositionZ || 0;
    this.endRotationX = options.endRotationX || 0;
    this.endRotationY = options.endRotationY || 0;
    this.endRotationZ = options.endRotationZ || 0;
    this.endScaleLock = options.endScaleLock === undefined ? true : options.endScaleLock;
    this.endScaleX = options.endScaleX || 1.0;
    this.endScaleY = options.endScaleY || 1.0;
    this.endScaleZ = options.endScaleZ || 1.0;
}

export default Animation;