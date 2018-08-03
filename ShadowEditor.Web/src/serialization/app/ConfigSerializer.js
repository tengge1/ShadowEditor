import BaseSerializer from '../BaseSerializer';

/**
 * Object3D序列化器
 */
function ConfigSerializer() {
    BaseSerializer.call(this);
}

ConfigSerializer.prototype = Object.create(BaseSerializer.prototype);
ConfigSerializer.prototype.constructor = ConfigSerializer;

ConfigSerializer.prototype.toJSON = function (obj) {
    var json = obj.toJSON();
    return json;
};

ConfigSerializer.prototype.fromJSON = function (json) {

};

export default ConfigSerializer;