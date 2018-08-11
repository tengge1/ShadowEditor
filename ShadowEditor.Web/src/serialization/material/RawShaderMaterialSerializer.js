import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * RawShaderMaterialSerializer
 * @param {*} app 
 */
function RawShaderMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

RawShaderMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
RawShaderMaterialSerializer.prototype.constructor = RawShaderMaterialSerializer;

RawShaderMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

RawShaderMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.RawShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default RawShaderMaterialSerializer;