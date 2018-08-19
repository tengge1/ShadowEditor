import BaseSerializer from './BaseSerializer';

// core
import Object3DSerializer from './core/Object3DSerializer';
import SceneSerializer from './core/SceneSerializer';
import MeshSerializer from './core/MeshSerializer';
import GroupSerializer from './core/GroupSerializer';
import SpriteSerializer from './core/SpriteSerializer';
import ServerObject from './core/ServerObject';
import WebGLRendererSerializer from './core/WebGLRendererSerializer';

// app
import OptionsSerializer from './app/OptionsSerializer';
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

    // 选项
    var config = (new OptionsSerializer(this.app)).toJSON(this.app.options);
    list.push(config);

    // 相机
    var camera = (new CamerasSerializer(this.app)).toJSON(this.app.editor.camera);
    list.push(camera);

    // 渲染器
    var renderer = (new WebGLRendererSerializer(this.app)).toJSON(this.app.editor.renderer);
    list.push(renderer);

    // 脚本
    var scripts = (new ScriptSerializer(this.app)).toJSON();
    scripts.forEach(n => {
        list.push(n);
    });

    // 序列化场景
    function serializerChildren(obj) {
        var json = null;

        if (obj.userData && obj.userData.Server === true) { // 服务器对象
            json = (new ServerObject(this.app)).toJSON(obj);
            list.push(json);
            return;
        }

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

        obj.children && obj.children.forEach(n => {
            serializerChildren.call(this, n);
        });
    };

    serializerChildren.call(this, app.editor.scene);

    return list;
};

Converter.prototype.fromJson = function (json) {
    // 选项
    var optionsJson = json.filter(n => n.metadata && n.metadata.generator === 'OptionsSerializer')[0];

    if (optionsJson) {
        (new OptionsSerializer(this.app)).fromJSON(optionsJson, this.app.options);
    } else {
        console.warn(`Converter: 场景中不存在配置信息。`);
    }

    // 相机
    var cameraJson = json.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];

    if (cameraJson) {
        (new CamerasSerializer(this.app)).fromJSON(cameraJson, this.app.editor.camera);
        this.app.editor.camera.updateProjectionMatrix();
    } else {
        console.warn(`Converter: 场景中不存在相机信息。`);
    }

    // 渲染器
    var rendererJson = json.filter(n => n.metadata && n.metadata.generator.indexOf('WebGLRendererSerializer') > -1)[0];
    if (rendererJson) {
        (new WebGLRendererSerializer(this.app)).fromJSON(rendererJson, this.app.editor.renderer);
    } else {
        console.warn(`Converter: 场景中不存在渲染器信息。`);
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

            if (objJson.userData && objJson.userData.Server === true) { // 服务端对象
                var promise = (new ServerObject(this.app)).fromJSON(objJson);
                promise.then(obj => {
                    if (obj) {
                        this.app.editor.scene.add(obj);
                        this.app.call('sceneGraphChanged', this);
                    }
                });
                return;
            }

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

            if (obj) {
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
