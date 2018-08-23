import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * SphereBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SphereBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

SphereBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
SphereBufferGeometrySerializer.prototype.constructor = SphereBufferGeometrySerializer;

SphereBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

SphereBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SphereBufferGeometry(
        json.parameters.radius,
        json.parameters.widthSegments,
        json.parameters.heightSegments,
        json.parameters.phiStart,
        json.parameters.phiLength,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SphereBufferGeometrySerializer;