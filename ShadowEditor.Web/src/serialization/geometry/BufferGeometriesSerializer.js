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
        console.warn(`BufferGeometriesSerializer: 未知Geometry类型 ${obj.type}`);
    }

    return json;
};

BufferGeometriesSerializer.prototype.fromJSON = function (json, parent) {
    var obj = null;

    if (json.type === 'BoxBufferGeometry') {
        obj = (new BoxBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'CircleBufferGeometry') {
        obj = (new CircleBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'ConeBufferGeometry') {
        obj = (new ConeBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'CylinderBufferGeometry') {
        obj = (new CylinderBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'DodecahedronBufferGeometry') {
        obj = (new DodecahedronBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'ExtrudeBufferGeometry') {
        obj = (new ExtrudeBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'IcosahedronBufferGeometry') {
        obj = (new IcosahedronBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'InstancedBufferGeometry') {
        obj = (new InstancedBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'LatheBufferGeometry') {
        obj = (new LatheBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'OctahedronBufferGeometry') {
        obj = (new OctahedronBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'ParametricBufferGeometry') {
        obj = (new ParametricBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'PlaneBufferGeometry') {
        obj = (new PlaneBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'RingBufferGeometry') {
        obj = (new RingBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'ShapeBufferGeometry') {
        obj = (new ShapeBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'SphereBufferGeometry') {
        obj = (new SphereBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'TeapotBufferGeometry') {
        obj = (new TeapotBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'TetrahedronBufferGeometry') {
        obj = (new TetrahedronBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'TextBufferGeometry') {
        obj = (new TextBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'TorusBufferGeometry') {
        obj = (new TorusBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'TorusKnotBufferGeometry') {
        obj = (new TorusKnotBufferGeometrySerializer()).fromJSON(json);
    } else if (json.type === 'TubeBufferGeometry') {
        obj = (new TubeBufferGeometrySerializer()).fromJSON(json);
    } else {
        console.warn(`BufferGeometriesSerializer: 无法反序列化 ${obj.type}`);
    }

    return obj;
};

export default BufferGeometriesSerializer;