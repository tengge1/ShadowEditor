var ID = -1;

/**
 * 序列化器基类
 */
function BaseSerializer() {
    this.id = 'BaseSerializer' + ID--;
}

/**
 * 转为json
 * @param {*} obj 对象
 */
BaseSerializer.prototype.toJSON = function (obj) {
    return {};
};

/**
 * json转对象
 * @param {*} json json字符串
 */
BaseSerializer.prototype.fromJSON = function (json) {
    return null;
};

export default BaseSerializer;