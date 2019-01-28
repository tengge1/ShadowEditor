import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

import GeometriesSerializer from '../geometry/GeometriesSerializer';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * SpriteSerializer
 * @author tengge / https://github.com/tengge1
 */
function SpriteSerializer() {
    BaseSerializer.call(this);
}

SpriteSerializer.prototype = Object.create(BaseSerializer.prototype);
SpriteSerializer.prototype.constructor = SpriteSerializer;

SpriteSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.center = obj.center;
    json.material = (new MaterialsSerializer()).toJSON(obj.material);
    json.z = obj.z;
    json.isSprite = obj.isSprite;

    return json;
};

SpriteSerializer.prototype.fromJSON = function (json, parent) {
    var material;

    if (parent === undefined) {
        if (json.material == null) {
            console.warn(`SpriteSerializer: ${json.name} json.material is not defined.`);
            return null;
        }
        material = (new MaterialsSerializer()).fromJSON(json.material);
    }

    var obj = parent === undefined ? new THREE.Sprite(material) : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.center.copy(json.center);
    obj.z = json.z;

    return obj;
};

export default SpriteSerializer;