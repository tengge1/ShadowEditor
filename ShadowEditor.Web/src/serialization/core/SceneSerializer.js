import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

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
    json.overrideMaterial = obj.overrideMaterial;

    return json;
};

SceneSerializer.prototype.fromJSON = function (json) {
    var obj = new THREE.Scene();

    Object3DSerializer.prototype.fromJSON(json, obj);

    if (json.background) {
        obj.background = new THREE.Color(json.background);
    }

    if (json.fog && json.fog.type === 'Fog') {
        obj.fog = new THREE.Fog(json.fog.color, json.fog.near, json.fog.far);
    } else if (json.fog && json.fog.type === 'FogExp2') {
        obj.fog = new THREE.FogExp2(json.fog.color, json.fog.density);
    } else if (json.fog) {
        console.warn(`SceneSerializer: unknown fog type ${json.fog.type}.`);
    }

    if (json.overrideMaterial) {
        obj.overrideMaterial = json.overrideMaterial;
        console.warn('TODO: //');
    }

    return obj;
};

export default SceneSerializer;