import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MultiMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function MultiMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

MultiMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MultiMaterialSerializer.prototype.constructor = MultiMaterialSerializer;

MultiMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MultiMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MultiMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MultiMaterialSerializer;