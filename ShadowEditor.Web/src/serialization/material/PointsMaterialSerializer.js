import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * PointsMaterialSerializer
 * @param {*} app 
 */
function PointsMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

PointsMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
PointsMaterialSerializer.prototype.constructor = PointsMaterialSerializer;

PointsMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

PointsMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PointsMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default PointsMaterialSerializer;