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
 * 设置位置命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {THREE.Vector3} newPosition 新位置
 * @param {THREE.Vector3} optionalOldPosition 可选旧位置
 * @constructor
 */
function SetPositionCommand(object, newPosition, optionalOldPosition) {
	Command.call(this);

	this.type = 'SetPositionCommand';
	this.name = _t('Set Position');
	this.updatable = true;

	this.object = object;

	if (object !== undefined && newPosition !== undefined) {
		this.oldPosition = object.position.clone();
		this.newPosition = newPosition.clone();
	}

	if (optionalOldPosition !== undefined) {
		this.oldPosition = optionalOldPosition.clone();
	}
}

SetPositionCommand.prototype = Object.create(Command.prototype);

Object.assign(SetPositionCommand.prototype, {
	constructor: SetPositionCommand,

	execute: function () {
		this.object.position.copy(this.newPosition);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	undo: function () {
		this.object.position.copy(this.oldPosition);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	update: function (command) {
		this.newPosition.copy(command.newPosition);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldPosition = this.oldPosition.toArray();
		output.newPosition = this.newPosition.toArray();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldPosition = new THREE.Vector3().fromArray(json.oldPosition);
		this.newPosition = new THREE.Vector3().fromArray(json.newPosition);
	}
});

export default SetPositionCommand;