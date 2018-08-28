import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * RectAreaLightSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function RectAreaLightSerializer(app) {
    BaseSerializer.call(this, app);
}

RectAreaLightSerializer.prototype = Object.create(BaseSerializer.prototype);
RectAreaLightSerializer.prototype.constructor = RectAreaLightSerializer;

RectAreaLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.width = obj.width;
    json.height = obj.height;

    return json;
};

RectAreaLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.RectAreaLight(json.color, json.intensity, json.width, json.height) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isRectAreaLight = true;

    return obj;
};

export default RectAreaLightSerializer;