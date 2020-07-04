/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseSerializer from '../BaseSerializer';

import BoxBufferGeometrySerializer from './BoxBufferGeometrySerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';
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
    'BoxBufferGeometry': BoxBufferGeometrySerializer,
    'BufferGeometry': BufferGeometrySerializer,
    'CircleBufferGeometry': CircleBufferGeometrySerializer,
    'ConeBufferGeometry': ConeBufferGeometrySerializer,
    'CylinderBufferGeometry': CylinderBufferGeometrySerializer,
    'DodecahedronBufferGeometry': DodecahedronBufferGeometrySerializer,
    'ExtrudeBufferGeometry': ExtrudeBufferGeometrySerializer,
    'IcosahedronBufferGeometry': IcosahedronBufferGeometrySerializer,
    'InstancedBufferGeometry': InstancedBufferGeometrySerializer,
    'LatheBufferGeometry': LatheBufferGeometrySerializer,
    'OctahedronBufferGeometry': OctahedronBufferGeometrySerializer,
    'ParametricBufferGeometry': ParametricBufferGeometrySerializer,
    'PlaneBufferGeometry': PlaneBufferGeometrySerializer,
    'PolyhedronBufferGeometry': PolyhedronBufferGeometrySerializer,
    'RingBufferGeometry': RingBufferGeometrySerializer,
    'ShapeBufferGeometry': ShapeBufferGeometrySerializer,
    'SphereBufferGeometry': SphereBufferGeometrySerializer,
    'TeapotBufferGeometry': TeapotBufferGeometrySerializer,
    'TetrahedronBufferGeometry': TetrahedronBufferGeometrySerializer,
    'TextBufferGeometry': TextBufferGeometrySerializer,
    'TorusBufferGeometry': TorusBufferGeometrySerializer,
    'TorusKnotBufferGeometry': TorusKnotBufferGeometrySerializer,
    'TubeBufferGeometry': TubeBufferGeometrySerializer
};

/**
 * GeometriesSerializer
 * @author tengge / https://github.com/tengge1
 */
function GeometriesSerializer() {
    BaseSerializer.call(this);
}

GeometriesSerializer.prototype = Object.create(BaseSerializer.prototype);
GeometriesSerializer.prototype.constructor = GeometriesSerializer;

GeometriesSerializer.prototype.toJSON = function (obj) {
    var serializer = Serializers[obj.type];

    if (serializer === undefined) {
        console.warn(`GeometriesSerializer: No serializer with ${obj.type}.`);
        return null;
    }

    return new serializer().toJSON(obj);
};

GeometriesSerializer.prototype.fromJSON = function (json, parent) {
    var generator = json.metadata.generator;

    var serializer = Serializers[generator.replace('Serializer', '')];

    if (serializer === undefined) {
        console.warn(`GeometriesSerializer: No deserializer with ${generator}.`);
        return null;
    }

    return new serializer().fromJSON(json, parent);
};

export default GeometriesSerializer;