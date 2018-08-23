import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ConeBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ConeBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

ConeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ConeBufferGeometrySerializer.prototype.constructor = ConeBufferGeometrySerializer;

ConeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ConeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ConeBufferGeometry(
        json.parameters.radius,
        json.parameters.height,
        json.parameters.radialSegments,
        json.parameters.heightSegments,
        json.parameters.openEnded,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ConeBufferGeometrySerializer;