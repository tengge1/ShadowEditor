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

import AddObjectCommand from '../command/AddObjectCommand';

/**
 * 场景序列化/反序列化类
 * @param {*} app 
 */
function Converter(app) {
    BaseSerializer.call(this, app);
}

Converter.prototype = Object.create(BaseSerializer.prototype);
Converter.prototype.constructor = Converter;

Converter.prototype.toJSON = function () {
    var list = [];

    // 配置
    var config = (new ConfigSerializer(this.app)).toJSON();
    list.push(config);

    // 相机
    var camera = (new CamerasSerializer(this.app)).toJSON(this.app.editor.camera);
    list.push(camera);

    // 脚本
    var scripts = (new ScriptSerializer(this.app)).toJSON();
    scripts.forEach(n => {
        list.push(n);
    });

    // 场景
    this.app.editor.scene.traverse(obj => {
        var json = null;
        switch (obj.constructor.name) {
            case 'Scene':
                json = (new SceneSerializer(this.app)).toJSON(obj);
                break;
            case 'Group':
                json = (new GroupSerializer(this.app)).toJSON(obj);
                break;
            case 'Mesh':
                json = (new MeshSerializer(this.app)).toJSON(obj);
                break;
            case 'Sprite':
                json = (new SpriteSerializer(this.app)).toJSON(obj);
                break;
            case 'AmbientLight':
                json = (new AmbientLightSerializer(this.app)).toJSON(obj);
                break;
            case 'DirectionalLight':
                json = (new DirectionalLightSerializer(this.app)).toJSON(obj);
                break;
            case 'HemisphereLight':
                json = (new HemisphereLightSerializer(this.app)).toJSON(obj);
                break;
            case 'PointLight':
                json = (new PointLightSerializer(this.app)).toJSON(obj);
                break;
            case 'RectAreaLight':
                json = (new RectAreaLightSerializer(this.app)).toJSON(obj);
                break;
            case 'SpotLight':
                json = (new SpotLightSerializer(this.app)).toJSON(obj);
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

Converter.prototype.fromJson = function (json) {
    // 配置
    var configJson = json.filter(n => n.metadata && n.metadata.generator === 'ConfigSerializer')[0];

    if (configJson) {
        (new ConfigSerializer(this.app)).fromJSON(configJson);
    } else {
        console.warn(`Converter: 场景中不存在配置信息。`);
    }

    // 相机
    var cameraJson = json.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];

    if (cameraJson) {
        var camera = (new CamerasSerializer(this.app)).fromJSON(cameraJson);
        if (camera) {
            this.app.editor.camera.copy(camera);
            this.app.editor.camera.updateProjectionMatrix();
        } else {
            console.warn(`Converter: 无法序列化${n.metadata.generator}。`);
        }
    } else {
        console.warn(`Converter: 场景中不存在相机信息。`);
    }

    // 脚本
    var scriptJsons = json.filter(n => n.metadata && n.metadata.generator === 'ScriptSerializer' > -1);
    if (scriptJsons) {
        (new ScriptSerializer(this.app)).fromJSON(scriptJsons);
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
                    obj = (new SceneSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'GroupSerializer':
                    obj = (new GroupSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'MeshSerializer':
                    obj = (new MeshSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'SpriteSerializer':
                    obj = (new SpriteSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'AmbientLightSerializer':
                    obj = (new AmbientLightSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'DirectionalLightSerializer':
                    obj = (new DirectionalLightSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'HemisphereLightSerializer':
                    obj = (new HemisphereLightSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'PointLightSerializer':
                    obj = (new PointLightSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'RectAreaLightSerializer':
                    obj = (new RectAreaLightSerializer(this.app)).fromJSON(objJson);
                    break;
                case 'SpotLightSerializer':
                    obj = (new SpotLightSerializer(this.app)).fromJSON(objJson);
                    break;
            }

            if (obj instanceof Promise) {
                obj.then(mesh => {
                    if (mesh) {
                        this.app.editor.scene.add(mesh);
                    }
                });
            } else if (obj) {
                parent.add(obj);
            } else {
                console.warn(`Converter: 不存在序列化${objJson.metadata.type}的反序列化器。`);
            }

            if (objJson && objJson.children && objJson.children.length > 0 && obj) {
                parseChildren.call(this, objJson, obj, list);
            }
        });
    }

    if (sceneJson) {
        scene = (new SceneSerializer(this.app)).fromJSON(sceneJson);
        parseChildren.call(this, sceneJson, scene, json);
    } else {
        console.warn(`Converter: 场景中不存在场景信息。`);
    }

    if (scene) {
        this.app.editor.setScene(scene);
    }
};

export default Converter;
