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
    var json = null;

    if (obj instanceof THREE.BoxBufferGeometry) {
        json = (new BoxBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.CircleBufferGeometry) {
        json = (new CircleBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.ConeBufferGeometry) {
        json = (new ConeBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.CylinderBufferGeometry) {
        json = (new CylinderBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.DodecahedronBufferGeometry) {
        json = (new DodecahedronBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.ExtrudeBufferGeometry) {
        json = (new ExtrudeBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.IcosahedronBufferGeometry) {
        json = (new IcosahedronBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.InstancedBufferGeometry) {
        json = (new InstancedBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.LatheBufferGeometry) {
        json = (new LatheBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.OctahedronBufferGeometry) {
        json = (new OctahedronBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.ParametricBufferGeometry) {
        json = (new ParametricBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.PlaneBufferGeometry) {
        json = (new PlaneBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.RingBufferGeometry) {
        json = (new RingBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.ShapeBufferGeometry) {
        json = (new ShapeBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.SphereBufferGeometry) {
        json = (new SphereBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.TeapotBufferGeometry) {
        json = (new TeapotBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.TetrahedronBufferGeometry) {
        json = (new TetrahedronBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.TextBufferGeometry) {
        json = (new TextBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.TorusBufferGeometry) {
        json = (new TorusBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.TorusKnotBufferGeometry) {
        json = (new TorusKnotBufferGeometrySerializer()).toJSON.call(this, obj);
    } else if (obj instanceof THREE.TubeBufferGeometry) {
        json = (new TubeBufferGeometrySerializer()).toJSON.call(this, obj);
    } else {
        console.warn(`BufferGeometriesSerializer: 未知Geometry类型 ${obj.type}`);
    }

    return json;
};

BufferGeometriesSerializer.prototype.fromJSON = function (json, parent) {

};

export default BufferGeometriesSerializer;