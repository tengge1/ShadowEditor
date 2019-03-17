import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ShadowMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function ShadowMaterialSerializer() {
    BaseSerializer.call(this);
}

ShadowMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ShadowMaterialSerializer.prototype.constructor = ShadowMaterialSerializer;

ShadowMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ShadowMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.ShadowMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default ShadowMaterialSerializer;