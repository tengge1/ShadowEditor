import Metadata from './Metadata';

import ConfigSerializer from './serializer/ConfigSerializer';

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
 * 所有序列化器
 */
var Serializers = {
    // 配置
    Config: {
        Serializer: ConfigSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: ConfigSerializer.name,
            type: 'Object'
        })
    },

    // 物体
    Object3D: {
        Serializer: Object3DSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: Object3DSerializer.name,
            type: THREE.Object3D.name
        })
    },

    // 场景
    Scene: {
        Serializer: SceneSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: SceneSerializer.name,
            type: THREE.Scene.name
        })
    },

    // 相机
    Camera: {
        Serializer: CameraSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: CameraSerializer.name,
            type: THREE.Camera.name
        })
    },

    OrthographicCamera: {
        Serializer: OrthographicCameraSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: OrthographicCameraSerializer.name,
            type: THREE.OrthographicCamera.name
        })
    },

    PerspectiveCamera: {
        Serializer: PerspectiveCameraSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: PerspectiveCameraSerializer.name,
            type: THREE.PerspectiveCamera.name
        })
    },

    // 光源
    Light: {
        Serializer: LightSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: LightSerializer.name,
            type: THREE.Light.name
        })
    },

    PointLight: {
        Serializer: PointLightSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: PointLightSerializer.name,
            type: THREE.PointLight.name
        })
    },

    SpotLight: {
        Serializer: SpotLightSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: SpotLightSerializer.name,
            type: THREE.SpotLight.name
        })
    },

    HemisphereLight: {
        Serializer: HemisphereLightSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: HemisphereLightSerializer.name,
            type: THREE.HemisphereLight.name
        })
    },

    RectAreaLight: {
        Serializer: RectAreaLightSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: RectAreaLightSerializer.name,
            type: THREE.RectAreaLight.name
        })
    },

    // 集合体
    Geometry: {
        Serializer: GeometrySerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: GeometrySerializer.name,
            type: THREE.Geometry.name
        })
    },

    // 材质
    Material: {
        Serializer: MaterialSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: MaterialSerializer.name,
            type: THREE.Material.name
        })
    },

    // 网格
    Mesh: {
        Serializer: MeshSerializer,
        Metadata: Object.assign({}, Metadata, {
            generator: MeshSerializer.name,
            type: THREE.Mesh.name
        })
    }
};

export default Serializers;