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
 * 移除物体命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @constructor
 */
function RemoveObjectCommand(object) {
	Command.call(this);

	this.type = 'RemoveObjectCommand';
	this.name = _t('Remove Object');

	this.object = object;

	this.parent = object !== undefined ? object.parent : undefined;

	if (this.parent !== undefined) {
		this.index = this.parent.children.indexOf(this.object);
	}
}

RemoveObjectCommand.prototype = Object.create(Command.prototype);

Object.assign(RemoveObjectCommand.prototype, {
	constructor: RemoveObjectCommand,

	execute: function () {
		// var scope = this.editor;

		this.parent.remove(this.object);

		if (this.object === this.editor.selected) {
			this.editor.select(null);
		}

		app.call('objectRemoved', this, this.object);
	},

	undo: function () {
		// var scope = this.editor;

		this.parent.children.splice(this.index, 0, this.object);
		this.object.parent = this.parent;
		this.editor.select(this.object);

		app.call('objectAdded', this, this.object);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);
		output.object = this.object.toJSON();
		output.index = this.index;
		output.parentUuid = this.parent.uuid;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.parent = this.editor.objectByUuid(json.parentUuid);
		if (this.parent === undefined) {
			this.parent = this.editor.scene;
		}

		this.index = json.index;

		this.object = this.editor.objectByUuid(json.object.object.uuid);
		if (this.object === undefined) {
			var loader = new THREE.ObjectLoader();
			this.object = loader.parse(json.object);
		}
	}
});

export default RemoveObjectCommand;
