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
    list.push(camera);

    // 脚本
    // Object.keys(app.editor.scripts).forEach(function (id) {
    //     var name = app.editor.scripts[id].name;
    //     var source = app.editor.scripts[id].source;
    //     var script = {
    //         Metadata: Serializers['Script'].Metadata,
    //         Object: Serializers['Script'].Serializer.toJSON({
    //             id: id,
    //             name: name,
    //             source: source
    //         })
    //     };
    //     list.push(script);
    // });

    // 场景
    app.editor.scene.traverse(function (obj) {
        var json = null;
        switch (obj.constructor.name) {
            case 'Scene':
                json = (new SceneSerializer()).toJSON(obj);
                break;
            // case 'Group':
            //     break;
            case 'Mesh':
                json = (new MeshSerializer()).toJSON(obj);
                break;
            // case 'Sprite':
            //     break;
            // case 'PointLight':
            //     json = (new PointLightSerializer()).toJSON(obj);
            //     break;
            // case 'SpotLight':
            //     json = (new SpotLightSerializer()).toJSON(obj);
            //     break;
            // case 'DirectionalLight':
            //     break;
            // case 'HemisphereLight':
            //     json = (new HemisphereLightSerializer()).toJSON(obj);
            //     break;
            // case 'AmbientLight':
            //     break;
        }
        if (json) {
            list.push(json);
        } else {
            console.warn(`Converter: There is no serializer to serialize ${obj.constructor.name}`);
        }
    });

    return list;
};

Converter.prototype.fromJson = function (app, json) {
    // 配置
    var configJson = json.filter(n => {
        return n.metadata && n.metadata.generator === 'ConfigSerializer';
    })[0];

    if (configJson) {
        (new ConfigSerializer()).fromJSON(app, configJson);
    } else {
        console.warn(`Converter: 场景中不存在配置信息。`);
    }

    // 相机
    var cameraJson = json.filter(n => {
        return n.metadata && (n.metadata.generator === 'OrthographicCameraSerializer' || n.metadata.generator === 'PerspectiveCameraSerializer');
    })[0];

    var camera = null;

    if (cameraJson.metadata.generator === 'OrthographicCameraSerializer') {
        camera = (new OrthographicCameraSerializer()).fromJSON(cameraJson);
    } else if (cameraJson.metadata.generator === 'PerspectiveCameraSerializer') {
        camera = (new PerspectiveCameraSerializer()).fromJSON(cameraJson);
    } else {
        console.warn(`Converter: 场景中不存在相机信息。`);
    }

    if (camera && camera.isCamera) {
        app.editor.camera.copy(camera);
        app.editor.camera.aspect = app.editor.DEFAULT_CAMERA.aspect;
        app.editor.camera.updateProjectionMatrix();
    }

    // 脚本


    // 场景
    var sceneJson = json.filter(n => {
        return n.metadata && n.metadata.generator === 'SceneSerializer';
    })[0];

    var scene = null;

    if (sceneJson) {
        scene = (new SceneSerializer()).fromJSON(sceneJson);
    } else {
        console.warn(`Converter: 场景中不存在场景信息。`);
    }

    if (scene) {
        app.editor.setScene(scene);
    }
};

export default Converter;
