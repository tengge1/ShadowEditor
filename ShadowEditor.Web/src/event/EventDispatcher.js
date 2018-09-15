import { dispatch } from '../third_party';
import EventList from './EventList';
import BaseEvent from './BaseEvent';

// 核心
import AnimateEvent from './AnimateEvent';
import KeyDownEvent from './KeyDownEvent';
import RenderEvent from './RenderEvent';
import ResizeEvent from './ResizeEvent';

// 工具栏
import SelectModeEvent from './toolbar/SelectModeEvent';
import TranslateModeEvent from './toolbar/TranslateModeEvent';
import RotateModeEvent from './toolbar/RotateModeEvent';
import ScaleModeEvent from './toolbar/ScaleModeEvent';

import AnchorPointEvent from './toolbar/AnchorPointEvent';
import HandModeEvent from './toolbar/HandModeEvent';
import ModelEvent from './toolbar/ModelEvent';
import PathModeEvent from './toolbar/PathModeEvent';

// 菜单栏
import AddGroupEvent from './menu/add/AddGroupEvent';
import AddPlaneEvent from './menu/add/AddPlaneEvent';
import AddBoxEvent from './menu/add/AddBoxEvent';
import AddCircleEvent from './menu/add/AddCircleEvent';
import AddCylinderEvent from './menu/add/AddCylinderEvent';
import AddSphereEvent from './menu/add/AddSphereEvent';
import AddIcosahedronEvent from './menu/add/AddIcosahedronEvent';
import AddTorusEvent from './menu/add/AddTorusEvent';
import AddTorusKnotEvent from './menu/add/AddTorusKnotEvent';
import AddTeaportEvent from './menu/add/AddTeaportEvent';
import AddLatheEvent from './menu/add/AddLatheEvent';
import AddSpriteEvent from './menu/add/AddSpriteEvent';
import AddPointLightEvent from './menu/add/AddPointLightEvent';
import AddSpotLightEvent from './menu/add/AddSpotLightEvent';
import AddDirectionalLightEvent from './menu/add/AddDirectionalLightEvent';
import AddHemisphereLightEvent from './menu/add/AddHemisphereLightEvent';
import AddAmbientLightEvent from './menu/add/AddAmbientLightEvent';
import AddRectAreaLightEvent from './menu/add/AddRectAreaLightEvent';
import AddTextEvent from './menu/add/AddTextEvent';
import AddPerspectiveCameraEvent from './menu/add/AddPerspectiveCameraEvent';

import ExportGeometryEvent from './menu/asset/ExportGeometryEvent';
import ExportObjectEvent from './menu/asset/ExportObjectEvent';
import ExportSceneEvent from './menu/asset/ExportSceneEvent';
import ExportGLTFEvent from './menu/asset/ExportGLTFEvent';
import ExportOBJEvent from './menu/asset/ExportOBJEvent';
import ExportPLYEvent from './menu/asset/ExportPLYEvent';
import ExportSTLBEvent from './menu/asset/ExportSTLBEvent';
import ExportSTLEvent from './menu/asset/ExportSTLEvent';

import AddFireEvent from '../editor/menubar/animation/AddFireEvent';
import AddSmokeEvent from '../editor/menubar/animation/AddSmokeEvent';
import AddMikuEvent from '../editor/menubar/animation/AddMikuEvent';

import AddPhysicsPlaneEvent from './menu/physics/AddPhysicsPlaneEvent';
import AddPhysicsWallEvent from './menu/physics/AddPhysicsWallEvent';
import AddPhysicsClothEvent from './menu/physics/AddPhysicsClothEvent';

import ParticleEmitterEvent from './menu/component/ParticleEmitterEvent';

import SurfaceOptionsEvent from './menu/options/SurfaceOptionsEvent';
import SceneOptionsEvent from './menu/options/SceneOptionsEvent';
import RendererOptionsEvent from './menu/options/RendererOptionsEvent';

import TransformControlsEvent from './viewport/TransformControlsEvent';
import UpdateSceneStatusEvent from './statusBar/UpdateSceneStatusEvent';
import ObjectEvent from './viewport/ObjectEvent';
import PickEvent from './PickEvent';
import EditorControlsEvent from './viewport/EditorControlsEvent';

import GridChangeEvent from './statusBar/GridChangeEvent';

/**
 * 事件执行器
 * @author tengge / https://github.com/tengge1
 */
function EventDispatcher(app) {
    this.app = app;
    this.dispatch = dispatch.apply(dispatch, EventList);
    this.addDomEventListener();

    this.events = [
        // 核心事件
        new AnimateEvent(this.app),
        new KeyDownEvent(this.app),
        new RenderEvent(this.app),
        new ResizeEvent(this.app),

        // 工具栏
        new SelectModeEvent(this.app),
        new TranslateModeEvent(this.app),
        new RotateModeEvent(this.app),
        new ScaleModeEvent(this.app),

        new AnchorPointEvent(this.app),
        new HandModeEvent(this.app),
        new ModelEvent(this.app),
        new PathModeEvent(this.app),

        // menubar中的事件
        new AddGroupEvent(this.app),
        new AddPlaneEvent(this.app),
        new AddBoxEvent(this.app),
        new AddCircleEvent(this.app),
        new AddCylinderEvent(this.app),
        new AddSphereEvent(this.app),
        new AddIcosahedronEvent(this.app),
        new AddTorusEvent(this.app),
        new AddTorusKnotEvent(this.app),
        new AddTeaportEvent(this.app),
        new AddLatheEvent(this.app),
        new AddSpriteEvent(this.app),
        new AddPointLightEvent(this.app),
        new AddSpotLightEvent(this.app),
        new AddDirectionalLightEvent(this.app),
        new AddHemisphereLightEvent(this.app),
        new AddAmbientLightEvent(this.app),
        new AddRectAreaLightEvent(this.app),
        new AddTextEvent(this.app),
        new AddPerspectiveCameraEvent(this.app),

        new ExportGeometryEvent(this.app),
        new ExportObjectEvent(this.app),
        new ExportSceneEvent(this.app),
        new ExportGLTFEvent(this.app),
        new ExportOBJEvent(this.app),
        new ExportPLYEvent(this.app),
        new ExportSTLBEvent(this.app),
        new ExportSTLEvent(this.app),

        new AddFireEvent(this.app),
        new AddSmokeEvent(this.app),
        new AddMikuEvent(this.app),

        new AddPhysicsPlaneEvent(this.app),
        new AddPhysicsWallEvent(this.app),
        new AddPhysicsClothEvent(this.app),

        new ParticleEmitterEvent(this.app),

        new SurfaceOptionsEvent(this.app),
        new SceneOptionsEvent(this.app),
        new RendererOptionsEvent(this.app),

        // viewport中的事件
        new TransformControlsEvent(this.app),
        new UpdateSceneStatusEvent(this.app),
        new ObjectEvent(this.app),
        new PickEvent(this.app),
        new EditorControlsEvent(this.app),

        // 状态栏事件
        new GridChangeEvent(this.app)
    ];
}

EventDispatcher.prototype = Object.create(BaseEvent.prototype);
EventDispatcher.prototype.constructor = EventDispatcher;

/**
 * 启动
 */
EventDispatcher.prototype.start = function () {
    this.events.forEach(n => {
        n.start();
    });
};

/**
 * 停止
 */
EventDispatcher.prototype.stop = function () {
    this.events.forEach(n => {
        n.stop();
    });
};

/**
 * 执行事件
 * @param {*} eventName 
 * @param {*} _this 
 * @param {*} others 
 */
EventDispatcher.prototype.call = function (eventName, _this, ...others) {
    this.dispatch.call(eventName, _this, ...others);
};

/**
 * 监听事件
 * @param {*} eventName 
 * @param {*} callback 
 */
EventDispatcher.prototype.on = function (eventName, callback) {
    this.dispatch.on(eventName, callback);
};

/**
 * 监听dom事件
 */
EventDispatcher.prototype.addDomEventListener = function () {
    var container = this.app.container;
    container.addEventListener('click', (event) => {
        this.dispatch.call('click', this, event);
    });
    container.addEventListener('contextmenu', (event) => {
        this.dispatch.call('contextmenu', this, event);
        event.preventDefault();
        return false;
    });
    container.addEventListener('dblclick', (event) => {
        this.dispatch.call('dblclick', this, event);
    });
    document.addEventListener('keydown', (event) => {
        this.dispatch.call('keydown', this, event);
    });
    document.addEventListener('keyup', (event) => {
        this.dispatch.call('keyup', this, event);
    });
    container.addEventListener('mousedown', (event) => {
        this.dispatch.call('mousedown', this, event);
    });
    container.addEventListener('mousemove', (event) => {
        this.dispatch.call('mousemove', this, event);
    });
    container.addEventListener('mouseup', (event) => {
        this.dispatch.call('mouseup', this, event);
    });
    container.addEventListener('mousewheel', (event) => {
        this.dispatch.call('mousewheel', this, event);
    });
    window.addEventListener('resize', (event) => {
        this.dispatch.call('resize', this, event);
    }, false);
    document.addEventListener('dragover', (event) => {
        this.dispatch.call('dragover', this, event);
    }, false);
    document.addEventListener('drop', (event) => {
        this.dispatch.call('drop', this, event);
    }, false);
};

export default EventDispatcher;