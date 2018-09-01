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
    var config = (new OptionsSerializer()).toJSON(options);
    list.push(config);

    // 相机
    var camera = (new CamerasSerializer()).toJSON(camera);
    list.push(camera);

    // 渲染器
    var renderer = (new WebGLRendererSerializer()).toJSON(renderer);
    list.push(renderer);

    // 脚本
    var scripts = (new ScriptSerializer()).toJSON(scripts);
    scripts.forEach(n => {
        list.push(n);
    });

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
            list.push(json);
            return;
        }

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
 */
Converter.prototype.fromJson = function (jsons) {
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
        (new OptionsSerializer()).fromJSON(optionsJson, obj.options);
    } else {
        console.warn(`Converter: 场景中不存在配置信息。`);
    }

    // 相机
    var cameraJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('CameraSerializer') > -1)[0];

    if (cameraJson) {
        obj.camera = new THREE.PerspectiveCamera();
        (new CamerasSerializer()).fromJSON(cameraJson, obj.camera);
        // this.app.editor.camera.updateProjectionMatrix();
    } else {
        console.warn(`Converter: 场景中不存在相机信息。`);
    }

    // 渲染器
    var rendererJson = jsons.filter(n => n.metadata && n.metadata.generator.indexOf('WebGLRendererSerializer') > -1)[0];
    if (rendererJson) {
        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        obj.renderer = (new WebGLRendererSerializer()).fromJSON(rendererJson);

        // this.app.viewport.container.dom.removeChild(this.app.editor.renderer.domElement);
        // this.app.editor.renderer = (new WebGLRendererSerializer()).fromJSON(rendererJson);
        // this.app.viewport.container.dom.appendChild(this.app.editor.renderer.domElement);
        // this.app.editor.renderer.setSize(this.app.viewport.container.dom.offsetWidth, this.app.viewport.container.dom.offsetHeight);
        // this.app.call('render', this);
    } else {
        console.warn(`Converter: 场景中不存在渲染器信息。`);
    }

    // 脚本
    var scriptJsons = jsons.filter(n => n.metadata && n.metadata.generator === 'ScriptSerializer');
    if (scriptJsons) {
        (new ScriptSerializer()).fromJSON(scriptJsons, obj.scripts);
    }

    // 场景
    var scene = this.sceneFromJson(jsons);

    if (scene) {
        this.app.editor.setScene(scene);
    }
};

/**
 * json转场景
 * @param {*} jsons 
 */
Converter.prototype.sceneFromJson = function (jsons) {
    var sceneJson = jsons.filter(n => n.metadata && n.metadata.generator === 'SceneSerializer')[0];

    if (sceneJson === undefined) {
        console.warn(`Converter: 场景中不存在场景信息。`);
        return new THREE.Scene();
    }

    var scene = (new SceneSerializer()).fromJSON(sceneJson);

    (function parse(json, parent, list) {
        json.children.forEach(n => {
            var objJson = list.filter(o => o.uuid === n)[0];
            if (objJson == null) {
                console.warn(`Converter: 场景中不存在uuid为${n}的对象数据。`);
                return;
            }

            var obj = null;

            if (objJson.userData && objJson.userData.Server === true) { // 服务端对象
                var promise = (new ServerObject()).fromJSON(objJson);
                promise.then(obj => {
                    if (obj) {
                        scene.add(obj);
                        // app.call('sceneGraphChanged', this);
                    }
                });
                return;
            }

            switch (objJson.metadata.generator) {
                case 'SceneSerializer':
                    obj = (new SceneSerializer()).fromJSON(objJson);
                    break;
                case 'GroupSerializer':
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
                parse.call(this, objJson, obj, list);
            }
        });
    })(sceneJson, scene, jsons);

    return scene;
};

export default Converter;
