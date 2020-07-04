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
 * 设置材质纹理命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 物体
 * @param {String} mapName 属性名称
 * @param {THREE.Texture} newMap 新纹理
 * @constructor
 */
function SetMaterialMapCommand(object, mapName, newMap) {
	Command.call(this);

	this.type = 'SetMaterialMapCommand';
	this.name = _t('Set Material') + '.' + mapName;

	this.object = object;
	this.mapName = mapName;
	this.oldMap = object !== undefined ? object.material[mapName] : undefined;
	this.newMap = newMap;
}

SetMaterialMapCommand.prototype = Object.create(Command.prototype);

Object.assign(SetMaterialMapCommand.prototype, {
	constructor: SetMaterialMapCommand,

	execute: function () {
		this.object.material[this.mapName] = this.newMap;
		this.object.material.needsUpdate = true;
	},

	undo: function () {
		this.object.material[this.mapName] = this.oldMap;
		this.object.material.needsUpdate = true;
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.mapName = this.mapName;
		output.newMap = serializeMap(this.newMap);
		output.oldMap = serializeMap(this.oldMap);

		return output;

		// serializes a map (THREE.Texture)

		function serializeMap(map) {
			if (map === null || map === undefined) return null;

			var meta = {
				geometries: {},
				materials: {},
				textures: {},
				images: {}
			};

			var json = map.toJSON(meta);
			var images = extractFromCache(meta.images);
			if (images.length > 0) json.images = images;
			json.sourceFile = map.sourceFile;

			return json;
		}

		// Note: The function 'extractFromCache' is copied from Object3D.toJSON()

		// extract data from the cache hash
		// remove metadata on each item
		// and return as array
		function extractFromCache(cache) {
			var values = [];
			for (var key in cache) {

				var data = cache[key];
				delete data.metadata;
				values.push(data);

			}
			return values;
		}
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.mapName = json.mapName;
		this.oldMap = parseTexture(json.oldMap);
		this.newMap = parseTexture(json.newMap);

		function parseTexture(json) {
			var map = null;
			if (json !== null) {

				var loader = new THREE.ObjectLoader();
				var images = loader.parseImages(json.images);
				var textures = loader.parseTextures([json], images);
				map = textures[json.uuid];
				map.sourceFile = json.sourceFile;

			}
			return map;
		}
	}
});

export default SetMaterialMapCommand;
