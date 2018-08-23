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

RectAreaLightSerializer.prototype.fromJSON = function (json) {

};

export default RectAreaLightSerializer;