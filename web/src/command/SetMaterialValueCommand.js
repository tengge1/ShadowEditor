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
 * 设置材质值命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {String} attributeName 属性名称
 * @param {String} newValue number, string, boolean or object
 * @constructor
 */
class SetMaterialValueCommand extends Command {
    constructor(object, attributeName, newValue) {
        super();
        this.type = 'SetMaterialValueCommand';
        this.name = _t('Set Material') + '.' + attributeName;
        this.updatable = true;

        this.object = object;
        this.oldValue = object !== undefined ? object.material[attributeName] : undefined;
        this.newValue = newValue;
        this.attributeName = attributeName;
    }

    execute() {
        this.object.material[this.attributeName] = this.newValue;
        this.object.material.needsUpdate = true;
        global.app.call('objectChanged', this, this.object);
    }

    undo() {
        this.object.material[this.attributeName] = this.oldValue;
        this.object.material.needsUpdate = true;
        global.app.call('objectChanged', this, this.object);
    }

    update(cmd) {
        this.newValue = cmd.newValue;
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

        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
        this.object = this.editor.objectByUuid(json.objectUuid);
    }
}

export default SetMaterialValueCommand;
