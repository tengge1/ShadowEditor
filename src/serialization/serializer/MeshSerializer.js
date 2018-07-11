import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * Mesh串行化
 */
function MeshSerializer() {
    BaseSerializer.call(this);
}

MeshSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshSerializer.prototype.constructor = MeshSerializer;

MeshSerializer.prototype.toJSON = function (obj) {
    var obj = Object3DSerializer.prototype.toJSON(obj);

    obj.drawMode = item.drawMode;
    obj.geometry = geometryToJson(item.geometry);
    obj.material = materialToJson(item.material);

    return obj;
};

MeshSerializer.prototype.fromJSON = function (json) {

};

export default MeshSerializer;