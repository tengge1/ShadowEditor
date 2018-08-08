import BaseSerializer from './BaseSerializer';

// core
import Object3DSerializer from './core/Object3DSerializer';
import SceneSerializer from './core/SceneSerializer';
import MeshSerializer from './core/MeshSerializer';
import GroupSerializer from './core/GroupSerializer';

// app
import ConfigSerializer from './app/ConfigSerializer';
import ScriptSerializer from './app/ScriptSerializer';

// camera
import OrthographicCameraSerializer from './camera/OrthographicCameraSerializer';
import PerspectiveCameraSerializer from './camera/PerspectiveCameraSerializer';

// light
import AmbientLightSerializer from './light/AmbientLightSerializer';
import DirectionalLightSerializer from './light/DirectionalLightSerializer';
import HemisphereLightSerializer from './light/HemisphereLightSerializer';
import PointLightSerializer from './light/PointLightSerializer';
import SpotLightSerializer from './light/SpotLightSerializer';
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
            case 'Group':
                json = (new GroupSerializer()).toJSON(obj);
                break;
            case 'Mesh':
                json = (new MeshSerializer()).toJSON(obj);
                break;
            // case 'Sprite':
            //     break;
            case 'AmbientLight':
                json = (new AmbientLightSerializer()).toJSON(obj);
                break;
            case 'DirectionalLight':
                json = (new DirectionalLightSerializer()).toJSON(obj);
                break;
            case 'HemisphereLight':
                json = (new HemisphereLightSerializer()).toJSON(obj);
                break;
            case 'PointLight':
                json = (new PointLightSerializer()).toJSON(obj);
                break;
            case 'RectAreaLight':
                json = (new RectAreaLightSerializer()).toJSON(obj);
                break;
            case 'SpotLight':
                json = (new SpotLightSerializer()).toJSON(obj);
                break;
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

    /**
     * 递归实例化场景所有子对象
     * @param {*} json 父元素json对象
     * @param {*} parent 父元素
     * @param {*} list 所有对象json数据列表
     */
    function parseChildren(json, parent, list) {
        if (json.children && json.children.length > 0) {
            json.children.forEach(n => {
                var objJson = list.filter(o => o.uuid === n)[0];
                if (objJson == null) {
                    console.warn(`Converter: 场景中不存在uuid为${n}的对象数据。`);
                    return;
                }
                var obj = null;
                if (objJson.metadata.generator === 'GroupSerializer') {
                    obj = (new GroupSerializer()).fromJSON(objJson);
                } else if (objJson.metadata.generator === 'MeshSerializer') {
                    obj = (new MeshSerializer()).fromJSON(objJson);
                } else {
                    console.warn(`Converter: 不存在序列化${objJson.metadata.type}的反序列化器。`);
                }

                if (obj) {
                    parent.add(obj);
                }

                if (objJson && objJson.children && obj) {
                    parseChildren(objJson, obj, list);
                }
            });
        }
    }

    if (sceneJson) {
        scene = (new SceneSerializer()).fromJSON(sceneJson);
        parseChildren(sceneJson, scene, json);
    } else {
        console.warn(`Converter: 场景中不存在场景信息。`);
    }

    if (scene) {
        app.editor.setScene(scene);
    }
};

export default Converter;
