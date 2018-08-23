import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ShadowMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ShadowMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

ShadowMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ShadowMaterialSerializer.prototype.constructor = ShadowMaterialSerializer;

ShadowMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ShadowMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ShadowMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ShadowMaterialSerializer;