import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ShaderMaterialSerializer
 */
function ShaderMaterialSerializer() {
    BaseSerializer.call(this);
}

ShaderMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ShaderMaterialSerializer.prototype.constructor = ShaderMaterialSerializer;

ShaderMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ShaderMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default ShaderMaterialSerializer;