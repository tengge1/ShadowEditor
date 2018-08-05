import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * Mesh序列化器
 */
function MeshSerializer() {
    BaseSerializer.call(this);
}

MeshSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshSerializer.prototype.constructor = MeshSerializer;

MeshSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    debugger

    json.drawMode = obj.drawMode;
    json.geometry = obj.geometry.toJSON();
    json.material = obj.material.toJSON();

    return json;
};

MeshSerializer.prototype.fromJSON = function (json) {

};

export default MeshSerializer;