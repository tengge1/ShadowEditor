import Object3DSerializer from './serializer/Object3DSerializer';

import SceneSerializer from './serializer/SceneSerializer';

import CameraSerializer from './serializer/CameraSerializer';
import OrthographicCameraSerializer from './serializer/OrthographicCameraSerializer';
import PerspectiveCameraSerializer from './serializer/PerspectiveCameraSerializer';

import LightSerializer from './serializer/LightSerializer';
import PointLightSerializer from './serializer/PointLightSerializer';
import SpotLightSerializer from './serializer/SpotLightSerializer';
import HemisphereLightSerializer from './serializer/HemisphereLightSerializer';
import RectAreaLightSerializer from './serializer/RectAreaLightSerializer';

import GeometrySerializer from './serializer/GeometrySerializer';

import MaterialSerializer from './serializer/MaterialSerializer';

import MeshSerializer from './serializer/MeshSerializer';

/**
 * 序列化类型
 */
var SerializerType = {
    [THREE.Object3D]: Object3DSerializer,

    [THREE.Scene]: SceneSerializer,

    [THREE.Camera]: CameraSerializer,
    [THREE.OrthographicCamera]: OrthographicCameraSerializer,
    [THREE.PerspectiveCamera]: PerspectiveCameraSerializer,

    [THREE.Light]: LightSerializer,
    [THREE.PointLight]: PointLightSerializer,
    [THREE.SpotLight]: SpotLightSerializer,
    [THREE.HemisphereLight]: HemisphereLightSerializer,
    [THREE.RectAreaLight]: RectAreaLightSerializer,

    [THREE.Geometry]: GeometrySerializer,

    [THREE.Material]: MaterialSerializer,

    [THREE.Mesh]: MeshSerializer
};

export default SerializerType;