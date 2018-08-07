import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * SpriteMaterialSerializer
 */
function SpriteMaterialSerializer() {
    BaseSerializer.call(this);
}

SpriteMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
SpriteMaterialSerializer.prototype.constructor = SpriteMaterialSerializer;

SpriteMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

SpriteMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SpriteMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default SpriteMaterialSerializer;