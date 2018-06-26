import { dispatch } from '../third_party';
import EventList from './EventList';
import BaseEvent from './BaseEvent';

import InitAppEvent from './app/InitAppEvent';

import DragOverEvent from './dom/DragOverEvent';
import DropEvent from './dom/DropEvent';
import KeyDownEvent from './dom/KeyDownEvent';
import ResizeEvent from './dom/ResizeEvent';
import MessageEvent from './dom/MessageEvent';
import LoadFromHashEvent from './editor/LoadFromHashEvent';
import AutoSaveEvent from './editor/AutoSaveEvent';
import VREvent from './editor/VREvent';

import SetThemeEvent from './editor/SetThemeEvent';
import SetSceneEvent from './editor/SetSceneEvent';
import AddObjectEvent from './editor/AddObjectEvent';
import MoveObjectEvent from './editor/MoveObjectEvent';
import NameObjectEvent from './editor/NameObjectEvent';
import RemoveObjectEvent from './editor/RemoveObjectEvent';
import AddGeometryEvent from './editor/AddGeometryEvent';
import SetGeometryNameEvent from './editor/SetGeometryNameEvent';
import AddMaterialEvent from './editor/AddMaterialEvent';
import SetMaterialNameEvent from './editor/SetMaterialNameEvent';
import AddTextureEvent from './editor/AddTextureEvent';
import AddHelperEvent from './editor/AddHelperEvent';
import RemoveHelperEvent from './editor/RemoveHelperEvent';
import AddScriptEvent from './editor/AddScriptEvent';
import RemoveScriptEvent from './editor/RemoveScriptEvent';
import SelectEvent from './editor/SelectEvent';
import ClearEvent from './editor/ClearEvent';
import LoadEvent from './editor/LoadEvent';
import SaveEvent from './editor/SaveEvent';

import NewSceneEvent from './menu/scene/NewSceneEvent';
import LoadSceneEvent from './menu/scene/LoadSceneEvent';
import SaveSceneEvent from './menu/scene/SaveSceneEvent';
import PublishSceneEvent from './menu/scene/PublishSceneEvent';

import UndoEvent from './menu/edit/UndoEvent';
import RedoEvent from './menu/edit/RedoEvent';
import ClearHistoryEvent from './menu/edit/ClearHistoryEvent';
import CloneEvent from './menu/edit/CloneEvent';
import DeleteEvent from './menu/edit/DeleteEvent';
import MinifyShaderEvent from './menu/edit/MinifyShaderEvent';

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
import AddPerspectiveCameraEvent from './menu/add/AddPerspectiveCameraEvent';

import ImportAssetEvent from './menu/asset/ImportAssetEvent';
import ExportGeometryEvent from './menu/asset/ExportGeometryEvent';
import ExportObjectEvent from './menu/asset/ExportObjectEvent';
import ExportSceneEvent from './menu/asset/ExportSceneEvent';
import ExportOBJEvent from './menu/asset/ExportOBJEvent';
import ExportSTLEvent from './menu/asset/ExportSTLEvent';

import PlayEvent from './menu/play/PlayEvent';

import VRModeEvent from './menu/view/VRModeEvent';

import ExampleEvent from './menu/example/ExampleEvent';

import SourceCodeEvent from './menu/help/SourceCodeEvent';
import AboutEvent from './menu/help/AboutEvent';

import TransformControlsEvent from './viewport/TransformControlsEvent';
import UpdateViewportInfoEvent from './viewport/UpdateViewportInfoEvent';
import RenderEvent from './viewport/RenderEvent';
import AnimateEvent from './viewport/AnimateEvent';
import ShowGridChangedEvent from './viewport/ShowGridChangedEvent';
import WindowResizeEvent from './viewport/WindowResizeEvent';
import SceneFogChangedEvent from './viewport/SceneFogChangedEvent';
import SceneBackgroundChangedEvent from './viewport/SceneBackgroundChangedEvent';
import HelperEvent from './viewport/HelperEvent';
import ObjectEvent from './viewport/ObjectEvent';
import GeometryEvent from './viewport/GeometryEvent';
import PickEvent from './viewport/PickEvent';

import TransformModeChangedEvent from './statusBar/TransformModeChangedEvent';
import GridChangeEvent from './statusBar/GridChangeEvent';

import CodeMirrorChangeEvent from './script/CodeMirrorChangeEvent';

/**
 * 事件执行器
 */
function EventDispatcher(app) {
    this.app = app;
    this.dispatch = dispatch.apply(dispatch, EventList);
    this.addDomEventListener();

    this.events = [
        // Application中的事件
        new DragOverEvent(this.app),
        new DropEvent(this.app),
        new KeyDownEvent(this.app),
        new ResizeEvent(this.app),
        //new MessageEvent(this.app),
        new LoadFromHashEvent(this.app),
        new AutoSaveEvent(this.app),
        new VREvent(this.app),
        new InitAppEvent(this.app),

        // Editor中的事件
        new SetThemeEvent(this.app),
        new SetSceneEvent(this.app),
        new AddObjectEvent(this.app),
        new MoveObjectEvent(this.app),
        new NameObjectEvent(this.app),
        new RemoveObjectEvent(this.app),
        new AddGeometryEvent(this.app),
        new SetGeometryNameEvent(this.app),
        new AddMaterialEvent(this.app),
        new SetMaterialNameEvent(this.app),
        new AddTextureEvent(this.app),
        new AddHelperEvent(this.app),
        new RemoveHelperEvent(this.app),
        new AddScriptEvent(this.app),
        new RemoveScriptEvent(this.app),
        new SelectEvent(this.app),
        new ClearEvent(this.app),
        new LoadEvent(this.app),
        new SaveEvent(this.app),

        // menubar中的事件
        new NewSceneEvent(this.app),
        new LoadSceneEvent(this.app),
        new SaveSceneEvent(this.app),
        new PublishSceneEvent(this.app),

        new UndoEvent(this.app),
        new RedoEvent(this.app),
        new ClearHistoryEvent(this.app),
        new CloneEvent(this.app),
        new DeleteEvent(this.app),
        new MinifyShaderEvent(this.app),

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
        new AddPerspectiveCameraEvent(this.app),

        new ImportAssetEvent(this.app),
        new ExportGeometryEvent(this.app),
        new ExportObjectEvent(this.app),
        new ExportSceneEvent(this.app),
        new ExportOBJEvent(this.app),
        new ExportSTLEvent(this.app),

        new PlayEvent(this.app),

        new VRModeEvent(this.app),

        new ExampleEvent(this.app),

        new SourceCodeEvent(this.app),
        new AboutEvent(this.app),

        // viewport中的事件
        new TransformControlsEvent(this.app),
        new UpdateViewportInfoEvent(this.app),
        new RenderEvent(this.app),
        new AnimateEvent(this.app),
        new ShowGridChangedEvent(this.app),
        new WindowResizeEvent(this.app),
        new SceneFogChangedEvent(this.app),
        new SceneBackgroundChangedEvent(this.app),
        new HelperEvent(this.app),
        new ObjectEvent(this.app),
        new GeometryEvent(this.app),
        new PickEvent(this.app),

        // statusBar中的事件
        new TransformModeChangedEvent(this.app),
        new GridChangeEvent(this.app),

        // 代码编辑器中的事件
        new CodeMirrorChangeEvent(this.app),
    ];
}

EventDispatcher.prototype = Object.create(BaseEvent.prototype);
EventDispatcher.prototype.constructor = EventDispatcher;

/**
 * 启动
 */
EventDispatcher.prototype.start = function () {
    this.events.forEach(function (n) {
        n.start();
    });
};

/**
 * 停止
 */
EventDispatcher.prototype.stop = function () {
    this.events.forEach(function (n) {
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
    window.addEventListener('message', (event) => {
        this.dispatch.call('message', this, event);
    });
};

export default EventDispatcher;