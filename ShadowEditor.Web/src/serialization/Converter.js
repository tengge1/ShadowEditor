import BaseSerializer from './BaseSerializer';

// core
import Object3DSerializer from './core/Object3DSerializer';
import SceneSerializer from './core/SceneSerializer';
import MeshSerializer from './core/MeshSerializer';
import GroupSerializer from './core/GroupSerializer';
import SpriteSerializer from './core/SpriteSerializer';

// app
import ConfigSerializer from './app/ConfigSerializer';
import ScriptSerializer from './app/ScriptSerializer';

// camera
import CamerasSerializer from './camera/CamerasSerializer';

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

Converter.prototype.toJSON = function (app) {
    var list = [];

    // 配置
    var config = (new ConfigSerializer()).toJSON(app);
    list.push(config);

    // 相机
    var camera = (new CamerasSerializer()).toJSON(app.editor.camera);
    list.push(camera);

    // 脚本
    var script = (new ScriptSerializer()).toJSON(app);
    list.push(script);

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
            case 'Sprite':
                json = (new SpriteSerializer()).toJSON(obj);
                break;
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
    var configJson = json.filter(n => n.metadata && n.metadata.generator === 'ConfigSerializer')[0];

    if (configJson) {
        (new ConfigSerializer()).fromJSON(app, configJson);
    } else {
        console.warn(`Converter: 场景中不存在配置信息。`);
    }

    // 相机
    var cameraJson = json.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];

    if (cameraJson) {
        var camera = (new CamerasSerializer()).fromJSON(cameraJson);
        if (camera) {
            app.editor.camera.copy(camera);
            app.editor.camera.updateProjectionMatrix();
        } else {
            console.warn(`Converter: 无法序列化${n.metadata.generator}。`);
        }
    } else {
        console.warn(`Converter: 场景中不存在相机信息。`);
    }

    // 脚本
    var scriptJson = json.filter(n => n.metadata && n.metadata.generator === 'ScriptSerializer' > -1)[0];
    if (scriptJson) {
        (new ScriptSerializer()).fromJSON(app, scriptJson);
    }

    // 场景
    var sceneJson = json.filter(n => n.metadata && n.metadata.generator === 'SceneSerializer')[0];

    var scene = null;

    /**
     * 递归实例化场景所有子对象
     * @param {*} json 父元素json对象
     * @param {*} parent 父元素
     * @param {*} list 所有对象json数据列表
     */
    function parseChildren(json, parent, list) {
        json.children.forEach(n => {
            var objJson = list.filter(o => o.uuid === n)[0];
            if (objJson == null) {
                console.warn(`Converter: 场景中不存在uuid为${n}的对象数据。`);
                return;
            }
            var obj = null;
            switch (objJson.metadata.generator) {
                case 'SceneSerializer':
                    obj = (new SceneSerializer()).fromJSON(objJson);
                    break;
                case 'GroupSerializer': // 组跟Object3D完全相同
                    obj = (new GroupSerializer()).fromJSON(objJson);
                    break;
                case 'MeshSerializer':
                    obj = (new MeshSerializer()).fromJSON(objJson);
                    break;
                case 'SpriteSerializer':
                    obj = (new SpriteSerializer()).fromJSON(objJson);
                    break;
                case 'AmbientLightSerializer':
                    obj = (new AmbientLightSerializer()).fromJSON(objJson);
                    break;
                case 'DirectionalLightSerializer':
                    obj = (new DirectionalLightSerializer()).fromJSON(objJson);
                    break;
                case 'HemisphereLightSerializer':
                    obj = (new HemisphereLightSerializer()).fromJSON(objJson);
                    break;
                case 'PointLightSerializer':
                    obj = (new PointLightSerializer()).fromJSON(objJson);
                    break;
                case 'RectAreaLightSerializer':
                    obj = (new RectAreaLightSerializer()).fromJSON(objJson);
                    break;
                case 'SpotLightSerializer':
                    obj = (new SpotLightSerializer()).fromJSON(objJson);
                    break;
            }

            if (obj) {
                parent.add(obj);
            } else {
                console.warn(`Converter: 不存在序列化${objJson.metadata.type}的反序列化器。`);
            }

            if (objJson && objJson.children && objJson.children.length > 0 && obj) {
                parseChildren(objJson, obj, list);
            }
        });
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
