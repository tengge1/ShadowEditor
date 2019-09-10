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
    let options = obj.options;
    let camera = obj.camera;
    let renderer = obj.renderer;
    let scripts = obj.scripts;
    let animations = obj.animations;
    let visual = obj.visual;
    let scene = obj.scene;

    let list = [];

    // 选项
    let configJson = (new OptionsSerializer()).toJSON(options);
    list.push(configJson);

    // 相机
    let cameraJson = (new CamerasSerializer()).toJSON(camera);
    list.push(cameraJson);

    // 渲染器
    let rendererJson = (new WebGLRendererSerializer()).toJSON(renderer);
    list.push(rendererJson);

    // 脚本
    let scriptsJson = (new ScriptSerializer()).toJSON(scripts);
    scriptsJson.forEach(n => {
        list.push(n);
    });

    // 动画
    let animationsJson = (new AnimationSerializer()).toJSON(animations);
    animationsJson.forEach(n => {
        list.push(n);
    });

    // 音频监听器
    let audioListener = camera.children.filter(n => n instanceof THREE.AudioListener)[0];
    if (audioListener) {
        let audioListenerJson = (new AudioListenerSerializer()).toJSON(audioListener);
        list.push(audioListenerJson);
    }

    // 可视化
    if (visual) {
        let visualJson = (new VisualSerializer()).toJSON(visual);
        list.push(visualJson);
    }

    // 将场景转为json
    let children = []; // 将层级结构保存在场景中，以供场景加载时还原。
    this.traverse(scene, children, list);

    let sceneJson = list.filter(n => n.uuid === scene.uuid)[0];

    if (sceneJson) {
        sceneJson.userData.children = children;
    } else {
        console.warn(`Converter: no scene json with id ${scene.uuid}`);
    }

    return list;
};

/**
 * 场景转json
 * @param {THREE.Object3D} obj 三维物体
 * @param {Object} children 子级结构
 * @param {Array} list json列表
 */
Converter.prototype.traverse = function (obj, children, list) {
    let json = null;

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
            let children1 = [];

            children.push({
                uuid: n.uuid,
                children: children1,
            });

            this.traverse(n, children1, list);
        });
    }
};

/**
 * 场景反序列化
 * @param {*} jsons json对象（列表）
 * @param {*} options 配置选项 格式：{ server: serverUrl } 其中，serverUrl为服务端地址，用于下载模型、纹理等资源
 * @param {*} options.server 服务端地址
 */
Converter.prototype.fromJson = function (jsons, options) {
    let obj = {
        options: null,
        camera: null,
        renderer: null,
        scripts: null,
        animations: [],
        svg: { html: '' },
        scene: null,
    };

    // 选项
    let optionsJson = jsons.filter(n => n.metadata && n.metadata.generator === 'OptionsSerializer')[0];
    if (optionsJson) {
        obj.options = (new OptionsSerializer()).fromJSON(optionsJson);
    } else {
        console.warn(`Converter: No config info in the scene.`);
    }

    // 相机
    let cameraJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];
    if (cameraJson) {
        obj.camera = (new CamerasSerializer()).fromJSON(cameraJson);
    } else {
        console.warn(`Converter: No camera info in the scene.`);
    }

    if (options.camera === undefined) {
        options.camera = obj.camera;
    }

    // 渲染器
    let rendererJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('WebGLRendererSerializer') > -1)[0];
    if (rendererJson) {
        obj.renderer = (new WebGLRendererSerializer()).fromJSON(rendererJson);
    } else {
        console.warn(`Converter: No renderer info in the scene.`);
    }

    if (options.renderer === undefined) {
        options.renderer = obj.renderer;
    }

    // 脚本
    let scriptJsons = jsons.filter(n => n.metadata && n.metadata.generator === 'ScriptSerializer');
    if (scriptJsons) {
        obj.scripts = (new ScriptSerializer()).fromJSON(scriptJsons);
    }

    // 动画
    let animationJsons = jsons.filter(n => n.metadata && n.metadata.generator === 'AnimationSerializer');
    if (animationJsons) {
        obj.animations = (new AnimationSerializer()).fromJSON(animationJsons);
    }

    // Visual
    let visualJson = jsons.filter(n => n.metadata && n.metadata.generator === 'VisualSerializer')[0];
    if (visualJson) {
        obj.visual = (new VisualSerializer()).fromJSON(visualJson);
    }

    // 音频监听器
    let audioListenerJson = jsons.filter(n => n.metadata && n.metadata.generator === 'AudioListenerSerializer')[0];
    let audioListener;
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
        this.parse(jsons, options).then(scene => {
            obj.scene = scene;
            resolve(obj);
        });
    });
};

const NoDeserializeSerializers = [
    'OptionsSerializer',
    'CamerasSerializer',
    'PerspectiveCameraSerializer',
    'OrthographicCameraSerializer',
    'WebGLRendererSerializer',
    'ScriptSerializer',
    'AnimationSerializer',
    'VisualSerializer',
    'AudioListenerSerializer',
    'SceneSerializer',
    'GlobeSerializer',
];

/**
 * json转场景
 * @param {*} jsons 反序列化对象列表
 * @param {*} options 配置信息
 */
Converter.prototype.parse = function (jsons, options) {
    // TODO: 由于有的模型上带Scene，这样判断得到的Scene可能不太准确。
    let sceneJson = jsons.filter(n => n.metadata && n.metadata.generator === 'SceneSerializer')[0];
    if (sceneJson === undefined) {
        console.warn(`Converter: No scene info in the scene.`);
        return new Promise(resolve => {
            resolve(new THREE.Scene());
        });
    }

    let scene = (new SceneSerializer()).fromJSON(sceneJson, undefined, options.server);
    let children = sceneJson.userData.children;

    if (!children) {
        console.warn(`Converter: scene has no children. Save your scene to update the date structure.`);
        return this.parseOld(sceneJson, scene, jsons, options);
    }

    // 将每个组件反序列化
    let parts = [scene];
    let serverParts = [];

    let promises = jsons.map(n => {
        const generator = n.metadata.generator;

        if (generator === 'ServerObject') {
            return new Promise(resolve => {
                (new ServerObject()).fromJSON(n, options, options).then(obj => {
                    this.traverseServerObject(obj, serverParts);
                    resolve();
                });
            });
        } else if (NoDeserializeSerializers.indexOf(generator) > -1) {

        } else if (generator === 'GroupSerializer') {
            parts.push((new GroupSerializer()).fromJSON(n));
        } else if (generator === 'ReflectorSerializer') {
            parts.push((new ReflectorSerializer()).fromJSON(n));
        } else if (generator === 'MeshSerializer') {
            parts.push((new MeshSerializer()).fromJSON(n, undefined, options.server));
        } else if (generator === 'SpriteSerializer') {
            parts.push((new SpriteSerializer()).fromJSON(n, undefined, options.server));
        } else if (generator === 'AmbientLightSerializer') {
            parts.push((new AmbientLightSerializer()).fromJSON(n));
        } else if (generator === 'DirectionalLightSerializer') {
            parts.push((new DirectionalLightSerializer()).fromJSON(n));
        } else if (generator === 'HemisphereLightSerializer') {
            parts.push((new HemisphereLightSerializer()).fromJSON(n));
        } else if (generator === 'PointLightSerializer') {
            parts.push((new PointLightSerializer()).fromJSON(n));
        } else if (generator === 'RectAreaLightSerializer') {
            parts.push((new RectAreaLightSerializer()).fromJSON(n));
        } else if (generator === 'SpotLightSerializer') {
            parts.push((new SpotLightSerializer()).fromJSON(n));
        } else if (generator === 'AudioSerializer') {
            parts.push((new AudioSerializer()).fromJSON(n, undefined, options.audioListener));
        } else if (generator === 'FireSerializer') {
            parts.push((new FireSerializer()).fromJSON(n, undefined, options.camera));
        } else if (generator === 'SmokeSerializer') {
            parts.push((new SmokeSerializer()).fromJSON(n, undefined, options.camera, options.renderer));
        } else if (generator === 'BoneSerializer') {
            parts.push((new BoneSerializer()).fromJSON(n));
        } else if (generator === 'SkySerializer') {
            parts.push((new SkySerializer()).fromJSON(n));
        } else if (generator === 'ParticleEmitterSerializer') {
            parts.push((new ParticleEmitterSerializer()).fromJSON(n, undefined, options.server));
        } else if (generator === 'PerlinTerrainSerializer') {
            parts.push((new PerlinTerrainSerializer()).fromJSON(n));
        } else if (generator === 'WaterSerializer') {
            parts.push((new WaterSerializer()).fromJSON(n, undefined, options.renderer));
        } else if (generator === 'ClothSerializer') {
            parts.push((new ClothSerializer()).fromJSON(n));
        } else if (generator === 'LineCurveSerializer') {
            parts.push((new LineCurveSerializer()).fromJSON(n));
        } else if (generator === 'CatmullRomCurveSerializer') {
            parts.push((new CatmullRomCurveSerializer()).fromJSON(n));
        } else if (generator === 'QuadraticBezierCurveSerializer') {
            parts.push((new QuadraticBezierCurveSerializer()).fromJSON(n));
        } else if (generator === 'CubicBezierCurveSerializer') {
            parts.push((new CubicBezierCurveSerializer()).fromJSON(n));
        } else if (generator === 'EllipseCurveSerializer') {
            parts.push((new EllipseCurveSerializer()).fromJSON(n));
        } else if (generator === 'Object3DSerializer') {
            parts.push((new Object3DSerializer()).fromJSON(n, undefined));
        } else {
            console.warn(`Converter: No Deserializer with ${generator}.`);
        }

        return new Promise(resolve => {
            resolve();
        });
    });

    // 根据children重新还原场景结构
    return new Promise(resolve => {
        Promise.all(promises).then(() => {
            this.parseScene(scene, children, parts, serverParts);
            resolve(scene);
        });
    });
};

/**
 * 新的组装场景方法
 * @description 由于只序列化了服务端模型的材质，所以优先采用服务端模型组件搭建场景，并用序列化的材质代替服务端材质。
 */
Converter.prototype.parseScene = function (parent, children, parts, serverParts) {
    children.forEach(child => {
        let obj = serverParts.filter(n => n.uuid === child.uuid)[0];

        if (obj) { // 服务端组件
            let obj1 = parts.filter(n => n.uuid === child.uuid)[0];

            if (obj1) { // 还原修改过的名称、位置、旋转、缩放等信息。
                obj.name = obj1.name;
                obj.position.copy(obj1.position);
                obj.rotation.copy(obj1.rotation);
                obj.scale.copy(obj1.scale);
                if (obj.material && obj1.material) {
                    obj.material = obj1.material;
                }
            } else {
                console.warn(`Converter: The components of ServerObject ${child.uuid} is not serialized.`);
            }
        } else {
            obj = parts.filter(n => n.uuid === child.uuid)[0];
        }

        if (!obj) {
            console.warn(`Converter: no element with uuid ${child.uuid}.`);
            return;
        }

        parent.add(obj);

        if (child.children.length > 0) {
            this.parseScene(obj, child.children, parts, serverParts);
        }
    });
};

/**
 * 将服务端模型分解为组件，并移除子组件
 */
Converter.prototype.traverseServerObject = function (obj, list) {
    list.push(obj);

    while (obj.children && obj.children.length) {
        let child = obj.children[0];
        obj.remove(child);
        this.traverseServerObject(child, list);
    }
};

/**
 * 旧的保存格式还原场景，即将删除
 */
Converter.prototype.parseOld = function (sceneJson, scene, jsons, options) {
    let serverObjects = [];
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

    let promises = serverObjects.map(serverObj => {
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
