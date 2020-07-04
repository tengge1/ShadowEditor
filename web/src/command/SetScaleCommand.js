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

/**
 * 设置缩放命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {THREE.Vector3} newScale 新缩放
 * @param {THREE.Vector3} optionalOldScale 可选旧缩放
 * @constructor
 */
function SetScaleCommand(object, newScale, optionalOldScale) {
	Command.call(this);

	this.type = 'SetScaleCommand';
	this.name = _t('Set Scale');
	this.updatable = true;

	this.object = object;

	if (object !== undefined && newScale !== undefined) {
		this.oldScale = object.scale.clone();
		this.newScale = newScale.clone();
	}

	if (optionalOldScale !== undefined) {
		this.oldScale = optionalOldScale.clone();
	}
}

SetScaleCommand.prototype = Object.create(Command.prototype);

Object.assign(SetScaleCommand.prototype, {
	constructor: SetScaleCommand,

	execute: function () {
		this.object.scale.copy(this.newScale);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	undo: function () {
		this.object.scale.copy(this.oldScale);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	update: function (command) {
		this.newScale.copy(command.newScale);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldScale = this.oldScale.toArray();
		output.newScale = this.newScale.toArray();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldScale = new THREE.Vector3().fromArray(json.oldScale);
		this.newScale = new THREE.Vector3().fromArray(json.newScale);
	}
});

export default SetScaleCommand;