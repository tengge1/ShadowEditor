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
 * 移动物体命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 当前物体
 * @param {THREE.Object3D} newParent 新的父要素
 * @param {THREE.Object3D} newBefore 旧的父要素
 * @constructor
 */
function MoveObjectCommand(object, newParent, newBefore) {
	Command.call(this);

	this.type = 'MoveObjectCommand';
	this.name = _t('Move Object');

	this.object = object;
	this.oldParent = object !== undefined ? object.parent : undefined;
	this.oldIndex = this.oldParent !== undefined ? this.oldParent.children.indexOf(this.object) : undefined;
	this.newParent = newParent;

	if (newBefore !== undefined) {
		this.newIndex = newParent !== undefined ? newParent.children.indexOf(newBefore) : undefined;
	} else {
		this.newIndex = newParent !== undefined ? newParent.children.length : undefined;
	}

	if (this.oldParent === this.newParent && this.newIndex > this.oldIndex) {
		this.newIndex--;
	}

	this.newBefore = newBefore;
}

MoveObjectCommand.prototype = Object.create(Command.prototype);

Object.assign(MoveObjectCommand.prototype, {
	constructor: MoveObjectCommand,

	execute: function () {
		this.oldParent.remove(this.object);

		var children = this.newParent.children;
		children.splice(this.newIndex, 0, this.object);
		this.object.parent = this.newParent;
	},

	undo: function () {
		this.newParent.remove(this.object);

		var children = this.oldParent.children;
		children.splice(this.oldIndex, 0, this.object);
		this.object.parent = this.oldParent;
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.newParentUuid = this.newParent.uuid;
		output.oldParentUuid = this.oldParent.uuid;
		output.newIndex = this.newIndex;
		output.oldIndex = this.oldIndex;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldParent = this.editor.objectByUuid(json.oldParentUuid);
		if (this.oldParent === undefined) {

			this.oldParent = this.editor.scene;

		}
		this.newParent = this.editor.objectByUuid(json.newParentUuid);
		if (this.newParent === undefined) {

			this.newParent = this.editor.scene;

		}
		this.newIndex = json.newIndex;
		this.oldIndex = json.oldIndex;
	}
});

export default MoveObjectCommand;
