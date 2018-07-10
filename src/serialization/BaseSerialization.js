var ID = -1;

/**
 * 序列化基类
 */
function BaseSerialization() {
    this.id = 'BaseSerialization' + ID--;
}

/**
 * 转为json字符串
 * @param {*} obj 对象
 */
BaseSerialization.prototype.toJSON = function (obj) {

};

/**
 * json字符串转对象
 * @param {*} json json字符串
 */
BaseSerialization.prototype.fromJSON = function (json) {

};

export default BaseSerialization;