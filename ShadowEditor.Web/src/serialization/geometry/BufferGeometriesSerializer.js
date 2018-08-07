import BaseSerializer from '../BaseSerializer';

import BoxBufferGeometrySerializer from './BoxBufferGeometrySerializer';
import CircleBufferGeometrySerializer from './CircleBufferGeometrySerializer';
import ConeBufferGeometrySerializer from './ConeBufferGeometrySerializer';
import CylinderBufferGeometrySerializer from './CylinderBufferGeometrySerializer';
import DodecahedronBufferGeometrySerializer from './DodecahedronBufferGeometrySerializer';
import ExtrudeBufferGeometrySerializer from './ExtrudeBufferGeometrySerializer';
import IcosahedronBufferGeometrySerializer from './IcosahedronBufferGeometrySerializer';
import InstancedBufferGeometrySerializer from './InstancedBufferGeometrySerializer';
import LatheBufferGeometrySerializer from './LatheBufferGeometrySerializer';
import OctahedronBufferGeometrySerializer from './OctahedronBufferGeometrySerializer';
import ParametricBufferGeometrySerializer from './ParametricBufferGeometrySerializer';
import PlaneBufferGeometrySerializer from './PlaneBufferGeometrySerializer';
import PolyhedronBufferGeometrySerializer from './PolyhedronBufferGeometrySerializer';
import RingBufferGeometrySerializer from './RingBufferGeometrySerializer';
import ShapeBufferGeometrySerializer from './ShapeBufferGeometrySerializer';
import SphereBufferGeometrySerializer from './SphereBufferGeometrySerializer';
import TeapotBufferGeometrySerializer from './TeapotBufferGeometrySerializer';
import TetrahedronBufferGeometrySerializer from './TetrahedronBufferGeometrySerializer';
import TextBufferGeometrySerializer from './TextBufferGeometrySerializer';
import TorusBufferGeometrySerializer from './TorusBufferGeometrySerializer';
import TorusKnotBufferGeometrySerializer from './TorusKnotBufferGeometrySerializer';
import TubeBufferGeometrySerializer from './TubeBufferGeometrySerializer';

/**
 * BufferGeometriesSerializer
 */
function BufferGeometriesSerializer() {
    BaseSerializer.call(this);
}

BufferGeometriesSerializer.prototype = Object.create(BaseSerializer.prototype);
BufferGeometriesSerializer.prototype.constructor = BufferGeometriesSerializer;

BufferGeometriesSerializer.prototype.toJSON = function (obj) {

};

BufferGeometriesSerializer.prototype.fromJSON = function (json, parent) {

};

export default BufferGeometriesSerializer;