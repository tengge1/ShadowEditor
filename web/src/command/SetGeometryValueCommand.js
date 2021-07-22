/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import Command from './Command';
import global from '../global';

/**
 * 设置几何体值命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {String} attributeName 属性名称
 * @param {Object} newValue number, string, boolean or object
 * @constructor
 */
class SetGeometryValueCommand extends Command {
    constructor(object, attributeName, newValue) {
        super();
        this.type = 'SetGeometryValueCommand';
        this.name = _t('Set Geometry') + '.' + attributeName;

        this.object = object;
        this.attributeName = attributeName;
        this.oldValue = object !== undefined ? object.geometry[attributeName] : undefined;
        this.newValue = newValue;
    }

    execute() {
        this.object.geometry[this.attributeName] = this.newValue;
        global.app.call('objectChanged', this, this.object);
        global.app.call('geometryChanged', this);
    }

    undo() {
        this.object.geometry[this.attributeName] = this.oldValue;
        global.app.call('objectChanged', this, this.object);
        global.app.call('geometryChanged', this);
    }

    toJSON() {
        var output = super.toJSON();

        output.objectUuid = this.object.uuid;
        output.attributeName = this.attributeName;
        output.oldValue = this.oldValue;
        output.newValue = this.newValue;

        return output;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.object = this.editor.objectByUuid(json.objectUuid);
        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
    }
}

export default SetGeometryValueCommand;