import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * CircleBufferGeometrySerializer
 * @param {*} app 
 */
function CircleBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

CircleBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
CircleBufferGeometrySerializer.prototype.constructor = CircleBufferGeometrySerializer;

CircleBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

CircleBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CircleBufferGeometry(
        json.parameters.radius,
        json.parameters.segments,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CircleBufferGeometrySerializer;