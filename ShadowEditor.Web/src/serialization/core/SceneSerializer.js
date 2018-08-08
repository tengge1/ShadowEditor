import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * Scene序列化器
 */
function SceneSerializer() {
    BaseSerializer.call(this);
}

SceneSerializer.prototype = Object.create(BaseSerializer.prototype);
SceneSerializer.prototype.constructor = SceneSerializer;

SceneSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.background = obj.background;
    json.fog = obj.fog;
    json.overrideMaterial = obj.overrideMaterial == null ? null : (new MaterialsSerializer()).toJSON(obj.overrideMaterial);

    return json;
};

SceneSerializer.prototype.fromJSON = function (json) {
    var obj = new THREE.Scene();

    Object3DSerializer.prototype.fromJSON(json, obj);
    obj.background = json.background == null ? null : new THREE.Color(json.background);

    if (json.fog && json.fog.type === 'Fog') {
        obj.fog = new THREE.Fog(json.fog.color, json.fog.near, json.fog.far);
    } else if (json.fog && json.fog.type === 'FogExp2') {
        obj.fog = new THREE.FogExp2(json.fog.color, json.fog.density);
    } else if (json.fog) {
        console.warn(`SceneSerializer: unknown fog type ${json.fog.type}.`);
    }

    obj.overrideMaterial = json.overrideMaterial == null ? null : (new MaterialsSerializer()).fromJSON(json.overrideMaterial);

    return obj;
};

export default SceneSerializer;