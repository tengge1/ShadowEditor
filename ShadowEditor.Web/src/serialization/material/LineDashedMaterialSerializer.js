import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * LineDashedMaterialSerializer
 */
function LineDashedMaterialSerializer() {
    BaseSerializer.call(this);
}

LineDashedMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
LineDashedMaterialSerializer.prototype.constructor = LineDashedMaterialSerializer;

LineDashedMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

LineDashedMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.LineDashedMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default LineDashedMaterialSerializer;