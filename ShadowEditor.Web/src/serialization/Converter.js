import BaseSerializer from './BaseSerializer';

// core
import Object3DSerializer from './core/Object3DSerializer';
import SceneSerializer from './core/SceneSerializer';
import MeshSerializer from './core/MeshSerializer';
import GroupSerializer from './core/GroupSerializer';
import BoneSerializer from './core/BoneSerializer';
import SpriteSerializer from './core/SpriteSerializer';
import ServerObject from './core/ServerObject';
import WebGLRendererSerializer from './core/WebGLRendererSerializer';

// app
import OptionsSerializer from './app/OptionsSerializer';
import ScriptSerializer from './app/ScriptSerializer';
import AnimationSerializer from './app/AnimationSerializer';

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
import FireSerializer from './objects/FireSerializer';
import SmokeSerializer from './objects/SmokeSerializer';
import SkySerializer from './objects/SkySerializer';
import ParticleEmitterSerializer from './objects/ParticleEmitterSerializer';
import PerlinTerrainSerializer from './objects/PerlinTerrainSerializer';
import WaterSerializer from './objects/WaterSerializer';
import ClothSerializer from './objects/ClothSerializer';

// line
import LineCurveSerializer from './line/LineCurveSerializer';
import CatmullRomCurveSerializer from './line/CatmullRomCurveSerializer';
import QuadraticBezierCurveSerializer from './line/QuadraticBezierCurveSerializer';
import CubicBezierCurveSerializer from './line/CubicBezierCurveSerializer';
import EllipseCurveSerializer from './line/EllipseCurveSerializer';

// gis
import GlobeSerializer from './gis/GlobeSerializer';

// visual
import VisualSerializer from './visual/VisualSerializer';

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
 * @param {Object} obj 需要序列化的对象
 * @param {Object} obj.options 配置信息
 * @param {THREE.Camera} obj.camera 相机
 * @param {THREE.WebGLRenderer} obj.renderer 渲染器 
 * @param {Array} obj.scripts 脚本列表
 * @param {Array} obj.animations 动画列表
 * @param {Object} obj.visual 可视化数据
 * @param {THREE.Scene} obj.scene 场景
 * @param {String} obj.server 服务端地址
 */
Converter.prototype.toJSON = function (obj) {
    var options = obj.options;
    var camera = obj.camera;
    var renderer = obj.renderer;
    var scripts = obj.scripts;
    var animations = obj.animations;
    var visual = obj.visual;
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

    // 动画
    var animationsJson = (new AnimationSerializer()).toJSON(animations);
    animationsJson.forEach(n => {
        list.push(n);
    });

    // 音频监听器
    var audioListener = camera.children.filter(n => n instanceof THREE.AudioListener)[0];
    if (audioListener) {
        var audioListenerJson = (new AudioListenerSerializer()).toJSON(audioListener);
        list.push(audioListenerJson);
    }

    // 可视化
    if (visual) {
        var visualJson = (new VisualSerializer()).toJSON(visual);
        list.push(visualJson);
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
    (function serialize(obj) {
        var json = null;

        if (obj.userData.Server === true) { // 服务器对象
            json = (new ServerObject()).toJSON(obj);
        } else if (obj.userData.type === 'Sky') {
            json = (new SkySerializer()).toJSON(obj);
        } else if (obj.userData.type === 'Fire') { // 火焰
            json = (new FireSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'Smoke') { // 烟
            json = (new SmokeSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'ParticleEmitter') { // 粒子发射器
            json = (new ParticleEmitterSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'PerlinTerrain') { // 柏林地形
            json = (new PerlinTerrainSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'Water') {
            json = (new WaterSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'Cloth') {
            json = (new ClothSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'LineCurve') {
            json = (new LineCurveSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'CatmullRomCurve') {
            json = (new CatmullRomCurveSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'QuadraticBezierCurve') {
            json = (new QuadraticBezierCurveSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'CubicBezierCurve') {
            json = (new CubicBezierCurveSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'EllipseCurve') {
            json = (new EllipseCurveSerializer()).toJSON(obj);
        } else if (obj.userData.type === 'Globe') {
            json = (new GlobeSerializer()).toJSON(obj);
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
        } else if (obj instanceof THREE.Bone) {
            json = (new BoneSerializer()).toJSON(obj);
        } else if (obj instanceof THREE.Object3D) {
            json = (new Object3DSerializer()).toJSON(obj);
        }

        if (json) {
            list.push(json);
        } else {
            console.warn(`Converter: No ${obj.constructor.name} Serializer.`);
        }

        // 1、如果obj.userData.type不为空，则为内置类型，其子项不应该序列化。
        // 2、服务器(模型)对象需要记录用户对模型的修改，需要序列化。
        if (obj.children && obj.userData.type === undefined) {
            obj.children.forEach(n => {
                serialize(n);
            });
        }
    })(scene);
};

/**
 * 场景反序列化
 * @param {*} jsons json对象（列表）
 * @param {*} options 配置选项 格式：{ server: serverUrl } 其中，serverUrl为服务端地址，用于下载模型、纹理等资源
 * @param {*} options.server 服务端地址
 */
Converter.prototype.fromJson = function (jsons, options) {
    var obj = {
        options: null,
        camera: null,
        renderer: null,
        scripts: null,
        animations: [],
        svg: { html: '' },
        scene: null,
    };

    // 选项
    var optionsJson = jsons.filter(n => n.metadata && n.metadata.generator === 'OptionsSerializer')[0];
    if (optionsJson) {
        obj.options = (new OptionsSerializer()).fromJSON(optionsJson);
    } else {
        console.warn(`Converter: No config info in the scene.`);
    }

    // 相机
    var cameraJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];
    if (cameraJson) {
        obj.camera = (new CamerasSerializer()).fromJSON(cameraJson);
    } else {
        console.warn(`Converter: No camera info in the scene.`);
    }

    if (options.camera === undefined) {
        options.camera = obj.camera;
    }

    // 渲染器
    var rendererJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('WebGLRendererSerializer') > -1)[0];
    if (rendererJson) {
        obj.renderer = (new WebGLRendererSerializer()).fromJSON(rendererJson);
    } else {
        console.warn(`Converter: No renderer info in the scene.`);
    }

    if (options.renderer === undefined) {
        options.renderer = obj.renderer;
    }

    // 脚本
    var scriptJsons = jsons.filter(n => n.metadata && n.metadata.generator === 'ScriptSerializer');
    if (scriptJsons) {
        obj.scripts = (new ScriptSerializer()).fromJSON(scriptJsons);
    }

    // 动画
    var animationJsons = jsons.filter(n => n.metadata && n.metadata.generator === 'AnimationSerializer');
    if (animationJsons) {
        obj.animations = (new AnimationSerializer()).fromJSON(animationJsons);
    }

    // Visual
    var visualJson = jsons.filter(n => n.metadata && n.metadata.generator === 'VisualSerializer')[0];
    if (visualJson) {
        obj.visual = (new VisualSerializer()).fromJSON(visualJson);
    }

    // 音频监听器
    var audioListenerJson = jsons.filter(n => n.metadata && n.metadata.generator === 'AudioListenerSerializer')[0];
    var audioListener;
    if (audioListenerJson) {
        audioListener = (new AudioListenerSerializer()).fromJSON(audioListenerJson);
    } else {
        console.warn(`Converter: No AudioListener in the scene.`);
        audioListener = new THREE.AudioListener();
    }
    obj.audioListener = audioListener;
    options.audioListener = audioListener;
    obj.camera.add(audioListener);

    // 场景
    return new Promise(resolve => {
        this.sceneFromJson(jsons, options, audioListener, obj.camera, obj.renderer).then(scene => {
            obj.scene = scene;
            resolve(obj);
        });
    });
};

/**
 * json转场景
 * @param {*} jsons 反序列化对象列表
 * @param {*} options 配置信息
 */
Converter.prototype.sceneFromJson = function (jsons, options) {
    var sceneJson = jsons.filter(n => n.metadata && n.metadata.generator === 'SceneSerializer')[0];
    if (sceneJson === undefined) {
        console.warn(`Converter: No scene info in the scene.`);
        return new Promise(resolve => {
            resolve(new THREE.Scene());
        });
    }

    var scene = (new SceneSerializer()).fromJSON(sceneJson, undefined, options.server);

    var serverObjects = [];
    let serverParts = []; // 保存服务器模型内部组件，以便还原内部结构。

    (function parseJson(json, parent, list) {
        json.children.forEach(n => {
            const objJson = list.filter(o => o.uuid === n)[0];

            if (objJson == null) {
                console.warn(`Converter: no object that uuid equals to ${n}.`);
                return;
            }

            if (objJson.userData && objJson.userData.Server === true) { // 服务器模型
                serverObjects.push({
                    parent: parent,
                    json: objJson
                });
            }

            let obj = null;

            switch (objJson.metadata.generator) {
                case 'SceneSerializer':
                    obj = (new SceneSerializer()).fromJSON(objJson, undefined, options.server);
                    break;
                case 'GroupSerializer':
                    obj = (new GroupSerializer()).fromJSON(objJson);
                    break;
                case 'ReflectorSerializer':
                    obj = (new ReflectorSerializer()).fromJSON(objJson);
                    break;
                case 'MeshSerializer':
                    obj = (new MeshSerializer()).fromJSON(objJson, undefined, options.server);
                    break;
                case 'SpriteSerializer':
                    obj = (new SpriteSerializer()).fromJSON(objJson, undefined, options.server);
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
                    obj = (new AudioSerializer()).fromJSON(objJson, undefined, options.audioListener);
                    break;
                case 'FireSerializer':
                    obj = (new FireSerializer()).fromJSON(objJson, undefined, options.camera);
                    break;
                case 'SmokeSerializer':
                    obj = (new SmokeSerializer()).fromJSON(objJson, undefined, options.camera, options.renderer);
                    break;
                case 'BoneSerializer':
                    obj = (new BoneSerializer()).fromJSON(objJson);
                    break;
                case 'SkySerializer':
                    obj = (new SkySerializer()).fromJSON(objJson);
                    break;
                case 'ParticleEmitterSerializer':
                    obj = (new ParticleEmitterSerializer()).fromJSON(objJson, undefined, options.server);
                    break;
                case 'PerlinTerrainSerializer':
                    obj = (new PerlinTerrainSerializer()).fromJSON(objJson);
                    break;
                case 'WaterSerializer':
                    obj = (new WaterSerializer()).fromJSON(objJson, undefined, options.renderer);
                    break;
                case 'ClothSerializer':
                    obj = (new ClothSerializer()).fromJSON(objJson);
                    break;
                case 'LineCurveSerializer':
                    obj = (new LineCurveSerializer()).fromJSON(objJson);
                    break;
                case 'CatmullRomCurveSerializer':
                    obj = (new CatmullRomCurveSerializer()).fromJSON(objJson);
                    break;
                case 'QuadraticBezierCurveSerializer':
                    obj = (new QuadraticBezierCurveSerializer()).fromJSON(objJson);
                    break;
                case 'CubicBezierCurveSerializer':
                    obj = (new CubicBezierCurveSerializer()).fromJSON(objJson);
                    break;
                case 'EllipseCurveSerializer':
                    obj = (new EllipseCurveSerializer()).fromJSON(objJson);
                    break;
                case 'ServerObject':
                    obj = (new Object3DSerializer()).fromJSON(objJson, undefined);
                    break;
                case 'Object3DSerializer':
                    obj = (new Object3DSerializer()).fromJSON(objJson, undefined);
                    break;
                case 'GlobeSerializer':
                    return;
            }

            if (!obj) {
                console.warn(`Converter: No Deserializer with ${objJson.metadata.generator}.`);
                return;
            }

            if (objJson.userData && objJson.userData.Server === true || parent === null) { // 服务端模型子组件
                serverParts.push(obj);
            } else { // 其他要素
                parent.add(obj);
            }

            // 说明：
            // 1、objJson.userData.type不为空，说明它是内置类型，其子项不应该被反序列化
            // 2、objJson.userData.Server为true是模型，子项会被反序列化，但是不会添加到父模型中。
            if (objJson.userData.type === undefined && Array.isArray(objJson.children) && objJson.children.length > 0) {
                if (objJson.userData && objJson.userData.Server === true || parent === null) { // 服务器模型或部件
                    parseJson(objJson, null, list);
                } else {
                    parseJson(objJson, obj, list);
                }
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
            (new ServerObject()).fromJSON(serverObj.json, options, {
                camera: options.camera,
                renderer: options.renderer,
                audioListener: options.audioListener,
                parts: serverParts,
            }).then(obj => {
                if (obj) {
                    if (serverObj.parent) {
                        serverObj.parent.add(obj);
                    } else {
                        console.warn(`Converter: the parent of serverObj with uuid ${serverObj.uuid} is null.`);
                    }
                } else {
                    console.warn(`Converter: Server assets ${serverObj.json.uuid} loaded failed.`);
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
