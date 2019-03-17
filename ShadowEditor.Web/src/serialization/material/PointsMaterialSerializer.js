import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * PointsMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function PointsMaterialSerializer() {
    BaseSerializer.call(this);
}

PointsMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
PointsMaterialSerializer.prototype.constructor = PointsMaterialSerializer;

PointsMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

PointsMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.PointsMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default PointsMaterialSerializer;