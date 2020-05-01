import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * LineBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function LineBasicMaterialSerializer() {
    BaseSerializer.call(this);
}

LineBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
LineBasicMaterialSerializer.prototype.constructor = LineBasicMaterialSerializer;

LineBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

LineBasicMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.LineBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default LineBasicMaterialSerializer;