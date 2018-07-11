import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * Scene串行化
 */
function SceneSerializer() {
    BaseSerializer.call(this);
}

SceneSerializer.prototype = Object.create(BaseSerializer.prototype);
SceneSerializer.prototype.constructor = SceneSerializer;

SceneSerializer.prototype.toJSON = function (obj) {
    var obj = Object3DSerializer.prototype.toJSON(obj);

    obj.background = item.background;
    obj.fog = item.fog;
    obj.overrideMaterial = item.overrideMaterial;

    return obj;
};

SceneSerializer.prototype.fromJSON = function (json) {

};

export default SceneSerializer;