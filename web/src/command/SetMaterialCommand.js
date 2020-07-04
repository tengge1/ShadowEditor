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
 * 设置材质命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {THREE.Material} newMaterial 新材质
 * @constructor
 */
function SetMaterialCommand(object, newMaterial) {
	Command.call(this);

	this.type = 'SetMaterialCommand';
	this.name = _t('New Material');

	this.object = object;
	this.oldMaterial = object !== undefined ? object.material : undefined;
	this.newMaterial = newMaterial;
}

SetMaterialCommand.prototype = Object.create(Command.prototype);

Object.assign(SetMaterialCommand.prototype, {
	constructor: SetMaterialCommand,

	execute: function () {
		this.object.material = this.newMaterial;
	},

	undo: function () {
		this.object.material = this.oldMaterial;
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldMaterial = this.oldMaterial.toJSON();
		output.newMaterial = this.newMaterial.toJSON();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldMaterial = parseMaterial(json.oldMaterial);
		this.newMaterial = parseMaterial(json.newMaterial);

		function parseMaterial(json) {
			var loader = new THREE.ObjectLoader();
			var images = loader.parseImages(json.images);
			var textures = loader.parseTextures(json.textures, images);
			var materials = loader.parseMaterials([json], textures);
			return materials[json.uuid];
		}
	}
});

export default SetMaterialCommand;
