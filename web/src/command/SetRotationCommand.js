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
 * 设置旋转命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {THREE.Euler} newRotation 新欧拉角
 * @param {THREE.Euler} optionalOldRotation 可选旧欧拉角
 * @constructor
 */
function SetRotationCommand(object, newRotation, optionalOldRotation) {
	Command.call(this);

	this.type = 'SetRotationCommand';
	this.name = _t('Set Rotation');
	this.updatable = true;

	this.object = object;

	if (object !== undefined && newRotation !== undefined) {
		this.oldRotation = object.rotation.clone();
		this.newRotation = newRotation.clone();
	}

	if (optionalOldRotation !== undefined) {
		this.oldRotation = optionalOldRotation.clone();
	}
}

SetRotationCommand.prototype = Object.create(Command.prototype);

Object.assign(SetRotationCommand.prototype, {
	constructor: SetRotationCommand,

	execute: function () {
		this.object.rotation.copy(this.newRotation);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	undo: function () {
		this.object.rotation.copy(this.oldRotation);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	update: function (command) {
		this.newRotation.copy(command.newRotation);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldRotation = this.oldRotation.toArray();
		output.newRotation = this.newRotation.toArray();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldRotation = new THREE.Euler().fromArray(json.oldRotation);
		this.newRotation = new THREE.Euler().fromArray(json.newRotation);
	}
});

export default SetRotationCommand;