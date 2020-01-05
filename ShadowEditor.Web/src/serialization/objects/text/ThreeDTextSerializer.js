import BaseSerializer from '../../BaseSerializer';
import Object3DSerializer from '../../core/Object3DSerializer';
import ThreeDText from '../../../object/text/ThreeDText';

/**
 * ThreeDTextSerializer
 * @author tengge / https://github.com/tengge1
 */
function ThreeDTextSerializer() {
    BaseSerializer.call(this);
}

ThreeDTextSerializer.prototype = Object.create(BaseSerializer.prototype);
ThreeDTextSerializer.prototype.constructor = ThreeDTextSerializer;

ThreeDTextSerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

ThreeDTextSerializer.prototype.fromJSON = function (json, parent) {
    var obj = new ThreeDText(json.userData.text, json.userData);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ThreeDTextSerializer;