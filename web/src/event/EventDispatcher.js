/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { dispatch } from '../third_party';

import EventList from './EventList';
import BaseEvent from './BaseEvent';

// 核心
import RenderEvent from './RenderEvent';
import ResizeEvent from './ResizeEvent';
import FilterEvent from './FilterEvent';
import ViewEvent from './ViewEvent';
import GPUPickEvent from './GPUPickEvent';
import WebSocketEvent from './WebSocketEvent';
import ScriptChangedEvent from './ScriptChangedEvent';
import AutoSaveEvent from './AutoSaveEvent';

import TransformControlsEvent from './TransformControlsEvent';
import ObjectEvent from './ObjectEvent';
import RaycastEvent from './RaycastEvent';
import PickEvent from './PickEvent';
import LoadSceneEvent from './LoadSceneEvent';
import WeatherEvent from './WeatherEvent';

// 物理引擎
import PhysicsEvent from './PhysicsEvent';

// // 可视化
// import DraggableEvent from './visual/DraggableEvent';

/**
 * 事件执行器
 * @author tengge / https://github.com/tengge1
 */
function EventDispatcher() {
    this.dispatch = dispatch.apply(dispatch, EventList);
    this.addDomEventListener();

    this.events = [
        // 核心事件
        new RenderEvent(),
        new ResizeEvent(),
        new FilterEvent(),
        new ViewEvent(),
        new GPUPickEvent(),
        new WebSocketEvent(),
        new ScriptChangedEvent(),
        new AutoSaveEvent(),

        // viewport中的事件
        new TransformControlsEvent(),
        new ObjectEvent(),
        new RaycastEvent(),
        new PickEvent(),
        new LoadSceneEvent(),
        new WeatherEvent(),

        // 物理引擎
        new PhysicsEvent()

        // // 可视化
        // new DraggableEvent()
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
 * @param {*} eventName 事件名称
 * @param {*} _this this指针
 * @param {*} others 其他参数
 */
EventDispatcher.prototype.call = function (eventName, _this, ...others) {
    this.dispatch.call(eventName, _this, ...others);
};

/**
 * 监听事件
 * @param {*} eventName 事件名称
 * @param {*} callback 回调函数
 */
EventDispatcher.prototype.on = function (eventName, callback) {
    this.dispatch.on(eventName, callback);
};

/**
 * 监听dom事件
 */
EventDispatcher.prototype.addDomEventListener = function () {
    var container = app.container;
    container.addEventListener('click', event => {
        this.dispatch.call('click', this, event);
    });
    container.addEventListener('contextmenu', event => {
        this.dispatch.call('contextmenu', this, event);
        event.preventDefault();
        return false;
    });
    container.addEventListener('dblclick', event => {
        this.dispatch.call('dblclick', this, event);
    });
    document.addEventListener('keydown', event => {
        this.dispatch.call('keydown', this, event);
    });
    document.addEventListener('keyup', event => {
        this.dispatch.call('keyup', this, event);
    });
    container.addEventListener('mousedown', event => {
        this.dispatch.call('mousedown', this, event);
    });
    container.addEventListener('mousemove', event => {
        this.dispatch.call('mousemove', this, event);
    });
    container.addEventListener('mouseup', event => {
        this.dispatch.call('mouseup', this, event);
    });
    container.addEventListener('mousewheel', event => {
        this.dispatch.call('mousewheel', this, event);
    });
    window.addEventListener('resize', event => {
        this.dispatch.call('resize', this, event);
    }, false);
    document.addEventListener('dragover', event => {
        this.dispatch.call('dragover', this, event);
    }, false);
    document.addEventListener('drop', event => {
        this.dispatch.call('drop', this, event);
    }, false);
};

export default EventDispatcher;