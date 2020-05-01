import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TubeBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function TubeBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TubeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TubeBufferGeometrySerializer.prototype.constructor = TubeBufferGeometrySerializer;

TubeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TubeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TubeBufferGeometry(
        json.parameters.path,
        json.parameters.tubularSegments,
        json.parameters.radius,
        json.parameters.radialSegments,
        json.parameters.closed
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TubeBufferGeometrySerializer;