import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * CylinderBufferGeometrySerializer
 * @param {*} app 
 */
function CylinderBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

CylinderBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
CylinderBufferGeometrySerializer.prototype.constructor = CylinderBufferGeometrySerializer;

CylinderBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

CylinderBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CylinderBufferGeometry(
        json.parameters.radiusTop,
        json.parameters.radiusBottom,
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

export default CylinderBufferGeometrySerializer;