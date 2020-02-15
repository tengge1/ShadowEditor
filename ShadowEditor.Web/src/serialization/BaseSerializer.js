import Metadata from './Metadata';

var ID = -1;

/**
 * 序列化器基类
 * @author tengge / https://github.com/tengge1
 */
function BaseSerializer() {
    this.id = 'BaseSerializer' + ID--;
    this.metadata = Object.assign({}, Metadata, {
        generator: this.constructor.name
    });
}

/**
 *对象转json
 * @param {Object} obj 对象
 * @returns {Object} JSON对象
 */
BaseSerializer.prototype.toJSON = function (obj) { // eslint-disable-line
    var json = {
        metadata: this.metadata
    };
    return json;
};

/**
 * json转对象
 * @param {Object} json json对象
 * @param {Object} parent 父对象
 * @returns {Object} 对象
 */
BaseSerializer.prototype.fromJSON = function (json, parent) { // eslint-disable-line
    if (parent) {
        return parent;
    }

    return {};
};

export default BaseSerializer;