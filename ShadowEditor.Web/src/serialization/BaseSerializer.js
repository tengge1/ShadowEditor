import Metadata from './Metadata';

var ID = -1;

/**
 * 序列化器基类
 * @param {*} app 
 */
function BaseSerializer(app) {
    this.id = 'BaseSerializer' + ID--;
    this.app = app;
    this.metadata = Object.assign({}, Metadata, {
        generator: this.constructor.name
    });
}

/**
 *对象转json
 * @param {*} obj 对象
 */
BaseSerializer.prototype.toJSON = function (obj) {
    var json = {
        metadata: this.metadata
    };
    return json;
};

/**
 * json转对象
 * @param {*} json json对象
 * @param {*} parent 父对象
 */
BaseSerializer.prototype.fromJSON = function (json, parent) {
    if (parent) {
        return parent;
    }

    return {};
};

export default BaseSerializer;