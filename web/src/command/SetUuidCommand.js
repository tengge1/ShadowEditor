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
 * 设置uuid命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {String} newUuid 新的UUID
 * @constructor
 */
function SetUuidCommand(object, newUuid) {
	Command.call(this);

	this.type = 'SetUuidCommand';
	this.name = _t('Update UUID');

	this.object = object;

	this.oldUuid = object !== undefined ? object.uuid : undefined;
	this.newUuid = newUuid;
}

SetUuidCommand.prototype = Object.create(Command.prototype);

Object.assign(SetUuidCommand.prototype, {
	constructor: SetUuidCommand,

	execute: function () {
		this.object.uuid = this.newUuid;
		app.call('objectChanged', this, this.object);
	},

	undo: function () {
		this.object.uuid = this.oldUuid;
		app.call('objectChanged', this, this.object);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.oldUuid = this.oldUuid;
		output.newUuid = this.newUuid;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.oldUuid = json.oldUuid;
		this.newUuid = json.newUuid;
		this.object = this.editor.objectByUuid(json.oldUuid);

		if (this.object === undefined) {
			this.object = this.editor.objectByUuid(json.newUuid);
		}
	}
});

export default SetUuidCommand;
