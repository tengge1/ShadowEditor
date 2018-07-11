var ID = -1;

/**
 * 序列化器基类
 */
function BaseSerializer() {
    this.id = 'BaseSerializer' + ID--;
}

/**
 * 转为json字符串
 * @param {*} obj 对象
 */
BaseSerializer.prototype.toJSON = function (obj) {
    return {};
};

/**
 * json字符串转对象
 * @param {*} json json字符串
 */
BaseSerializer.prototype.fromJSON = function (json) {
    return null;
};

export default BaseSerializer;