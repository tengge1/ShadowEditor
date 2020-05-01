import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';
import Fire from '../../object/component/Fire';

/**
 * FireSerializer
 * @author tengge / https://github.com/tengge1
 */
function FireSerializer() {
    BaseSerializer.call(this);
}

FireSerializer.prototype = Object.create(BaseSerializer.prototype);
FireSerializer.prototype.constructor = FireSerializer;

FireSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    delete json.userData.fire;

    return json;
};

FireSerializer.prototype.fromJSON = function (json, parent, camera) { // eslint-disable-line
    var fire = new Fire(camera, {
        width: json.userData.width,
        height: json.userData.height,
        depth: json.userData.depth,
        sliceSpacing: json.userData.sliceSpacing
    });

    Object3DSerializer.prototype.fromJSON.call(this, json, fire);

    fire.userData.fire.update(0);

    return fire;
};

export default FireSerializer;