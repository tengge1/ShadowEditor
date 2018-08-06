import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TubeBufferGeometrySerializer
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
    var obj = parent === undefined ? new THREE.TubeBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default TubeBufferGeometrySerializer;