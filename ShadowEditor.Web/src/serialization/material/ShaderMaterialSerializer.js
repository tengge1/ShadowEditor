import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ShaderMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ShaderMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

ShaderMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ShaderMaterialSerializer.prototype.constructor = ShaderMaterialSerializer;

ShaderMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ShaderMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ShaderMaterialSerializer;