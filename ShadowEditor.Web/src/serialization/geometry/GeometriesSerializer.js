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

var Serializers = {
    'BoxBufferGeometrySerializer': BoxBufferGeometrySerializer,
    'CircleBufferGeometrySerializer': CircleBufferGeometrySerializer,
    'ConeBufferGeometrySerializer': ConeBufferGeometrySerializer,
    'CylinderBufferGeometrySerializer': CylinderBufferGeometrySerializer,
    'DodecahedronBufferGeometrySerializer': DodecahedronBufferGeometrySerializer,
    'ExtrudeBufferGeometrySerializer': ExtrudeBufferGeometrySerializer,
    'IcosahedronBufferGeometrySerializer': IcosahedronBufferGeometrySerializer,
    'InstancedBufferGeometrySerializer': InstancedBufferGeometrySerializer,
    'LatheBufferGeometrySerializer': LatheBufferGeometrySerializer,
    'OctahedronBufferGeometrySerializer': OctahedronBufferGeometrySerializer,
    'ParametricBufferGeometrySerializer': ParametricBufferGeometrySerializer,
    'PlaneBufferGeometrySerializer': PlaneBufferGeometrySerializer,
    'PolyhedronBufferGeometrySerializer': PolyhedronBufferGeometrySerializer,
    'RingBufferGeometrySerializer': RingBufferGeometrySerializer,
    'ShapeBufferGeometrySerializer': ShapeBufferGeometrySerializer,
    'SphereBufferGeometrySerializer': SphereBufferGeometrySerializer,
    'TeapotBufferGeometrySerializer': TeapotBufferGeometrySerializer,
    'TetrahedronBufferGeometrySerializer': TetrahedronBufferGeometrySerializer,
    'TextBufferGeometrySerializer': TextBufferGeometrySerializer,
    'TorusBufferGeometrySerializer': TorusBufferGeometrySerializer,
    'TorusKnotBufferGeometrySerializer': TorusKnotBufferGeometrySerializer,
    'TubeBufferGeometrySerializer': TubeBufferGeometrySerializer
};

/**
 * GeometriesSerializer
 */
function BufferGeometriesSerializer() {
    BaseSerializer.call(this);
}

GeometriesSerializer.prototype = Object.create(BaseSerializer.prototype);
GeometriesSerializer.prototype.constructor = GeometriesSerializer;

GeometriesSerializer.prototype.toJSON = function (obj) {
    var json = null;

    if (obj instanceof THREE.BoxBufferGeometry) {
        json = (new BoxBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.CircleBufferGeometry) {
        json = (new CircleBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ConeBufferGeometry) {
        json = (new ConeBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.CylinderBufferGeometry) {
        json = (new CylinderBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.DodecahedronBufferGeometry) {
        json = (new DodecahedronBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ExtrudeBufferGeometry) {
        json = (new ExtrudeBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.IcosahedronBufferGeometry) {
        json = (new IcosahedronBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.InstancedBufferGeometry) {
        json = (new InstancedBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.LatheBufferGeometry) {
        json = (new LatheBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.OctahedronBufferGeometry) {
        json = (new OctahedronBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ParametricBufferGeometry) {
        json = (new ParametricBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.PlaneBufferGeometry) {
        json = (new PlaneBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.RingBufferGeometry) {
        json = (new RingBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ShapeBufferGeometry) {
        json = (new ShapeBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.SphereBufferGeometry) {
        json = (new SphereBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.TeapotBufferGeometry) {
        json = (new TeapotBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.TetrahedronBufferGeometry) {
        json = (new TetrahedronBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.TextBufferGeometry) {
        json = (new TextBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.TorusBufferGeometry) {
        json = (new TorusBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.TorusKnotBufferGeometry) {
        json = (new TorusKnotBufferGeometrySerializer()).toJSON(obj);
    } else if (obj instanceof THREE.TubeBufferGeometry) {
        json = (new TubeBufferGeometrySerializer()).toJSON(obj);
    } else {
        console.warn(`GeometriesSerializer: 未知Geometry类型 ${obj.type}`);
    }

    return json;
};

GeometriesSerializer.prototype.fromJSON = function (json) {
    var generator = json.metadata.generator;

    if (Serializers[generator] === undefined) {
        console.warn(`GeometriesSerializer: 不存在 ${generator} 的反序列化器`);
        return null;
    }

    return (new (Serializers[generator])()).fromJSON(json);
};

export default GeometriesSerializer;