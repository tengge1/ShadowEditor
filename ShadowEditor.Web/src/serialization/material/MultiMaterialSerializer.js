import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MultiMaterialSerializer
 */
function MultiMaterialSerializer() {
    BaseSerializer.call(this);
}

MultiMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MultiMaterialSerializer.prototype.constructor = MultiMaterialSerializer;

MultiMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MultiMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MultiMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default MultiMaterialSerializer;