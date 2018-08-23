import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * SpriteMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SpriteMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

SpriteMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
SpriteMaterialSerializer.prototype.constructor = SpriteMaterialSerializer;

SpriteMaterialSerializer.prototype.toJSON = function (obj) {
    var json = MaterialSerializer.prototype.toJSON.call(this, obj);
    json.isSpriteMaterial = true;
    return json;
};

SpriteMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SpriteMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SpriteMaterialSerializer;