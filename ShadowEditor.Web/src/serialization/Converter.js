import BaseSerializer from './BaseSerializer';

// core
import Object3DSerializer from './core/Object3DSerializer';
import SceneSerializer from './core/SceneSerializer';
import MeshSerializer from './core/MeshSerializer';

// app
import ConfigSerializer from './app/ConfigSerializer';
import ScriptSerializer from './app/ScriptSerializer';

// camera
import OrthographicCameraSerializer from './camera/OrthographicCameraSerializer';
import PerspectiveCameraSerializer from './camera/PerspectiveCameraSerializer';

// light
import PointLightSerializer from './light/PointLightSerializer';
import SpotLightSerializer from './light/SpotLightSerializer';
import HemisphereLightSerializer from './light/HemisphereLightSerializer';
import RectAreaLightSerializer from './light/RectAreaLightSerializer';

/**
 * 场景序列化/反序列化类
 */
function Converter() {
    BaseSerializer.call(this);

    this.serializers = [
        new ConfigSerializer(),
        new ScriptSerializer(),
        new Object3DSerializer(),
        new SceneSerializer(),

        new CameraSerializer(),
        new OrthographicCameraSerializer(),
        new PerspectiveCameraSerializer(),

        new LightSerializer(),
        new PointLightSerializer(),
        new SpotLightSerializer(),
        new HemisphereLightSerializer(),
        new RectAreaLightSerializer(),
        new GeometrySerializer(),

        new MaterialSerializer(),

        new MeshSerializer()
    ];
}

Converter.prototype = Object.create(BaseSerializer.prototype);
Converter.prototype.constructor = Converter;

Converter.prototype.filter = function (obj) {
    return false;
};

Converter.prototype.toJSON = function (app) {
    var list = [];

    // 配置
    var config = (new ConfigSerializer()).toJSON(app);
    list.push(config);

    // 相机
    var camera;
    if (app.editor.camera instanceof THREE.OrthographicCamera) {
        camera = (new OrthographicCameraSerializer()).toJSON(app.editor.camera);
    } else {
        camera = (new PerspectiveCameraSerializer()).toJSON(app.editor.camera);
    }

    // 脚本
    Object.keys(app.editor.scripts).forEach(function (id) {
        var name = app.editor.scripts[id].name;
        var source = app.editor.scripts[id].source;
        var script = {
            Metadata: Serializers['Script'].Metadata,
            Object: Serializers['Script'].Serializer.toJSON({
                id: id,
                name: name,
                source: source
            })
        };
        list.push(script);
    });

    // 场景
    // app.editor.scene.traverse(function (obj) {
    //     if (Serializers[obj.constructor.name] != null) {
    //         var json = {
    //             Metadata: Serializers[obj.constructor.name].Metadata,
    //             Object: Serializers[obj.constructor.name].Serializer.toJSON(obj)
    //         };
    //         list.push(json);
    //     } else {
    //         console.log(`There is no serializer to serialize ${obj.name}`);
    //     }
    // });

    return list;
};

Converter.prototype.fromJson = function (json) {

};

export default Converter;
