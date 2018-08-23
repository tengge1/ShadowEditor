import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * LineBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function LineBasicMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

LineBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
LineBasicMaterialSerializer.prototype.constructor = LineBasicMaterialSerializer;

LineBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

LineBasicMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.LineBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default LineBasicMaterialSerializer;