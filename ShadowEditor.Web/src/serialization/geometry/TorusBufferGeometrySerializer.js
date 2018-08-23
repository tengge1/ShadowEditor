import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TorusBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function TorusBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

TorusBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TorusBufferGeometrySerializer.prototype.constructor = TorusBufferGeometrySerializer;

TorusBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TorusBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TorusBufferGeometry(
        json.parameters.radius,
        json.parameters.tube,
        json.parameters.radialSegments,
        json.parameters.tubularSegments,
        json.parameters.arc
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TorusBufferGeometrySerializer;