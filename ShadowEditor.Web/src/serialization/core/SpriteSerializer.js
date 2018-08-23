import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

import GeometriesSerializer from '../geometry/GeometriesSerializer';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * SpriteSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SpriteSerializer(app) {
    BaseSerializer.call(this, app);
}

SpriteSerializer.prototype = Object.create(BaseSerializer.prototype);
SpriteSerializer.prototype.constructor = SpriteSerializer;

SpriteSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.center = obj.center;
    json.material = (new MaterialsSerializer(this.app)).toJSON(obj.material);
    json.z = obj.z;
    json.isSprite = obj.isSprite;

    return json;
};

SpriteSerializer.prototype.fromJSON = function (json, parent) {
    var material;

    if (parent === undefined) {
        if (json.material == null) {
            console.warn(`SpriteSerializer: ${json.name} json.material未定义。`);
            return null;
        }
        material = (new MaterialsSerializer(this.app)).fromJSON(json.material);
    }

    var obj = parent === undefined ? new THREE.Sprite(material) : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.center.copy(json.center);
    obj.z = json.z;

    return obj;
};

export default SpriteSerializer;