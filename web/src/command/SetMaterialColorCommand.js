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

let color = new THREE.Color();

/**
 * 设置材质颜色命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {String} attributeName 属性名称
 * @param {String} newValue integer representing a hex color value or a hex string startsWith `#`
 * @constructor
 */
function SetMaterialColorCommand(object, attributeName, newValue) {
	Command.call(this);

	this.type = 'SetMaterialColorCommand';
	this.name = _t('Set Material') + '.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = object !== undefined ? this.object.material[this.attributeName].getHex() : undefined;

	if (Number.isInteger(newValue)) {
		this.newValue = newValue;
	} else { // #ffffff
		color.set(newValue);
		this.newValue = color.getHex();
	}
}

SetMaterialColorCommand.prototype = Object.create(Command.prototype);

Object.assign(SetMaterialColorCommand.prototype, {
	constructor: SetMaterialColorCommand,

	execute: function () {
		this.object.material[this.attributeName].setHex(this.newValue);
	},

	undo: function () {
		this.object.material[this.attributeName].setHex(this.oldValue);
	},

	update: function (cmd) {
		this.newValue = cmd.newValue;
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
	}
});

export default SetMaterialColorCommand;
