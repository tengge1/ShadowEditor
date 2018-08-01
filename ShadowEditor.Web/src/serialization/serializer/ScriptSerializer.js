import BaseSerializer from '../BaseSerializer';

/**
 * Object3D序列化器
 */
function ScriptSerializer() {
    BaseSerializer.call(this);
}

ScriptSerializer.prototype = Object.create(BaseSerializer.prototype);
ScriptSerializer.prototype.constructor = ScriptSerializer;

ScriptSerializer.prototype.toJSON = function (obj) {
    return obj;
};

ScriptSerializer.prototype.fromJSON = function (json) {

};

export default ScriptSerializer;