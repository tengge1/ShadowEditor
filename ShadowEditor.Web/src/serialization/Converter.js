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

// audio
import AudioSerializer from './audio/AudioSerializer';
import AudioListenerSerializer from './audio/AudioListenerSerializer';

// objects
import ReflectorSerializer from './objects/ReflectorSerializer';

/**
 * 场景序列化/反序列化类
 * @author tengge / https://github.com/tengge1
 */
function Converter() {
    BaseSerializer.call(this);
}

Converter.prototype = Object.create(BaseSerializer.prototype);
Converter.prototype.constructor = Converter;

/**
 * 将应用转为json
 * @param {*} obj 格式：{ options: options, camera: camera, renderer: renderer, scripts: scripts, scene: scene }
 */
Converter.prototype.toJSON = function (obj) {
    var options = obj.options;
    var camera = obj.camera;
    var renderer = obj.renderer;
    var scripts = obj.scripts;
    var scene = obj.scene;

    var list = [];

    // 选项
    var configJson = (new OptionsSerializer()).toJSON(options);
    list.push(configJson);

    // 相机
    var cameraJson = (new CamerasSerializer()).toJSON(camera);
    list.push(cameraJson);

    // 渲染器
    var rendererJson = (new WebGLRendererSerializer()).toJSON(renderer);
    list.push(rendererJson);

    // 脚本
    var scriptsJson = (new ScriptSerializer()).toJSON(scripts);
    scriptsJson.forEach(n => {
        list.push(n);
    });

    // 音频监听器
    var audioListener = camera.children.filter(n => n instanceof THREE.AudioListener)[0];
    if (audioListener) {
        var audioListenerJson = (new AudioListenerSerializer()).toJSON(audioListener);
        list.push(audioListenerJson);
    }

    // 场景
    this.sceneToJson(scene, list);

    return list;
};

/**
 * 场景转json
 * @param {*} scene 场景
 * @param {*} list 用于保存json的空数组
 */
Converter.prototype.sceneToJson = function (scene, list) {
    (function serializer(obj) {
        var json = null;

        if (obj.userData && obj.userData.Server === true) { // 服务器对象
            json = (new ServerObject()).toJSON(obj);
        } else if (obj instanceof THREE.Scene) {
            json = (new SceneSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.Group) {
            json = (new GroupSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.Reflector) {
            json = (new ReflectorSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.Mesh) {
            json = (new MeshSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.Sprite) {
            json = (new SpriteSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.AmbientLight) {
            json = (new AmbientLightSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.DirectionalLight) {
            json = (new DirectionalLightSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.HemisphereLight) {
            json = (new HemisphereLightSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.PointLight) {
            json = (new PointLightSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.RectAreaLight) {
            json = (new RectAreaLightSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.SpotLight) {
            json = (new SpotLightSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.Audio) {
            json = (new AudioSerializer()).toJSON(obj);
        }

        if (json) {
            list.push(json);
        } else {
            console.warn(`Converter: 没有 ${obj.constructor.name} 的序列化器。`);
        }

        obj.children && obj.children.forEach(n => {
            serializer.call(this, n);
        });
    })(scene);
};

/**
 * 场景反序列化
 * @param {*} jsons json对象（列表）
 * @param {*} options 配置选项 格式：{ server: serverUrl } 其中，serverUrl为服务端地址，用于下载模型、纹理等资源
 */
Converter.prototype.fromJson = function (jsons, options) {
    var obj = {
        options: null,
        camera: null,
        renderer: null,
        scripts: null,
        scene: null
    };

    // 选项
    var optionsJson = jsons.filter(n => n.metadata && n.metadata.generator === 'OptionsSerializer')[0];
    if (optionsJson) {
        obj.options = (new OptionsSerializer()).fromJSON(optionsJson);
    } else {
        console.warn(`Converter: 场景中不存在配置信息。`);
    }

    // 相机
    var cameraJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];
    if (cameraJson) {
        obj.camera = (new CamerasSerializer()).fromJSON(cameraJson);
    } else {
        console.warn(`Converter: 场景中不存在相机信息。`);
    }

    // 渲染器
    var rendererJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('WebGLRendererSerializer') > -1)[0];
    if (rendererJson) {
        obj.renderer = (new WebGLRendererSerializer()).fromJSON(rendererJson);
    } else {
        console.warn(`Converter: 场景中不存在渲染器信息。`);
    }

    // 脚本
    var scriptJsons = jsons.filter(n => n.metadata && n.metadata.generator === 'ScriptSerializer');
    if (scriptJsons) {
        obj.scripts = (new ScriptSerializer()).fromJSON(scriptJsons);
    }

    // 音频监听器
    var audioListenerJson = jsons.filter(n => n.metadata && n.metadata.generator === 'AudioListenerSerializer')[0];
    var audioListener;
    if (audioListenerJson) {
        audioListener = (new AudioListenerSerializer()).fromJSON(audioListenerJson);
    } else {
        console.warn(`Converter: 场景种不存在音频监听器信息。`);
        audioListener = new THREE.AudioListener();
    }
    obj.audioListener = audioListener;
    obj.camera.add(audioListener);

    // 场景
    return new Promise(resolve => {
        this.sceneFromJson(jsons, options, audioListener).then(scene => {
            obj.scene = scene;
            resolve(obj);
        });
    });
};

/**
 * json转场景
 * @param {*} jsons 反序列化对象列表
 * @param {*} options 配置信息
 * @param {*} audioListener 音频监听器
 */
Converter.prototype.sceneFromJson = function (jsons, options, audioListener) {
    var sceneJson = jsons.filter(n => n.metadata && n.metadata.generator === 'SceneSerializer')[0];
    if (sceneJson === undefined) {
        console.warn(`Converter: 数据中不存在场景信息。`);
        return new Promise(resolve => {
            resolve(new THREE.Scene());
        });
    }

    var scene = (new SceneSerializer()).fromJSON(sceneJson);

    var serverObjects = [];

    (function parseJson(json, parent, list) {
        json.children.forEach(n => {
            var objJson = list.filter(o => o.uuid === n)[0];
            if (objJson == null) {
                console.warn(`Converter: 数据中不存在uuid为${n}的对象数据。`);
                return;
            }

            if (objJson.userData && objJson.userData.Server === true) { // 服务端对象
                serverObjects.push({
                    parent: parent,
                    json: objJson
                });
                return;
            }

            var obj = null;

            switch (objJson.metadata.generator) {
                case 'SceneSerializer':
                    obj = (new SceneSerializer()).fromJSON(objJson);
                    break;
                case 'GroupSerializer':
                    obj = (new GroupSerializer()).fromJSON(objJson);
                    break;
                case 'ReflectorSerializer':
                    obj = (new ReflectorSerializer()).fromJSON(objJson);
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
                case 'AudioSerializer':
                    obj = (new AudioSerializer()).fromJSON(objJson, undefined, audioListener);
                    break;
            }

            if (obj) {
                parent.add(obj);
            } else {
                console.warn(`Converter: 不存在${objJson.metadata.type}的反序列化器。`);
            }

            if (objJson.children && Array.isArray(objJson.children) && objJson.children.length > 0 && obj) {
                parseJson(objJson, obj, list);
            }
        });
    })(sceneJson, scene, jsons);

    if (serverObjects.length === 0) {
        return new Promise(resolve => {
            resolve(scene);
        });
    }

    var promises = serverObjects.map(serverObj => {
        return new Promise(resolve => {
            (new ServerObject()).fromJSON(serverObj.json, options).then(obj => {
                if (obj) {
                    serverObj.parent.add(obj);
                } else {
                    console.warn(`Converter: 服务器资源${serverObj.json.uuid}下载失败。`);
                }
                resolve();
            });
        });
    })

    return new Promise(resolve => {
        Promise.all(promises).then(() => {
            resolve(scene);
        });
    });
};

export default Converter;
