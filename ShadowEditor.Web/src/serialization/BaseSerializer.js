import Metadata from './Metadata';

var ID = -1;

/**
 * 序列化器基类
 */
function BaseSerializer() {
    this.id = 'BaseSerializer' + ID--;
    this.metadata = Object.assign({}, Metadata, {
        generator: this.constructor.name
    });
}

/**
 * 判断对象或字符串是否满足转换条件，满足返回true，不满足返回false
 * @param {*} obj 
 */
BaseSerializer.prototype.filter = function (obj) {

};

/**
 *对象转json
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