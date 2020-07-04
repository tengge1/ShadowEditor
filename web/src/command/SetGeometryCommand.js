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
 * 设置几何体命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {THREE.Geometry} newGeometry 几何体
 * @constructor
 */
function SetGeometryCommand(object, newGeometry) {
	Command.call(this);

	this.type = 'SetGeometryCommand';
	this.name = _t('Set Geometry');
	this.updatable = true;

	this.object = object;
	this.oldGeometry = object !== undefined ? object.geometry : undefined;
	this.newGeometry = newGeometry;
}

SetGeometryCommand.prototype = Object.create(Command.prototype);

Object.assign(SetGeometryCommand.prototype, {
	constructor: SetGeometryCommand,

	execute: function () {
		this.object.geometry.dispose();
		this.object.geometry = this.newGeometry;
		this.object.geometry.computeBoundingSphere();

		app.call('geometryChanged', this, this.object);
	},

	undo: function () {
		this.object.geometry.dispose();
		this.object.geometry = this.oldGeometry;
		this.object.geometry.computeBoundingSphere();

		app.call('geometryChanged', this, this.object);
	},

	update: function (cmd) {
		this.newGeometry = cmd.newGeometry;
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldGeometry = this.object.geometry.toJSON();
		output.newGeometry = this.newGeometry.toJSON();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);

		this.oldGeometry = parseGeometry(json.oldGeometry);
		this.newGeometry = parseGeometry(json.newGeometry);

		function parseGeometry(data) {
			var loader = new THREE.ObjectLoader();
			return loader.parseGeometries([data])[data.uuid];
		}
	}
});

export default SetGeometryCommand;
