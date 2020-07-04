/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from '../BaseEvent';

/**
 * 拖动事件
 * @author tengge / https://github.com/tengge1
 */
function DraggableEvent() {
    BaseEvent.call(this);
}

DraggableEvent.prototype = Object.create(BaseEvent.prototype);
DraggableEvent.prototype.constructor = DraggableEvent;

DraggableEvent.prototype.start = function () {
    app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
};

DraggableEvent.prototype.onAppStarted = function () {
    var visual = app.editor.visual;
    var component = null;

    var drag = d3.drag()
        .on('start', function () {
            var target = d3.event.sourceEvent.target;

            var id = d3.select(target).attr('data-id');

            if (!id) {
                return;
            }

            component = visual.get(id);
        })
        .on('drag', function () {
            if (!component) {
                return;
            }

            if (component.setTranslate) {
                component.setTranslate(d3.event.dx, d3.event.dy);
            }
        })
        .on('end', function () {
            component = null;
        });

    d3.select(app.editor.svg)
        .call(drag);
};

export default DraggableEvent;