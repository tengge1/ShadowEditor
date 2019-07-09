import Command from './Command';

/**
 * 移除物体命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param object THREE.Object3D
 * @constructor
 */
function RemoveObjectCommand(object) {
	Command.call(this);

	this.type = 'RemoveObjectCommand';
	this.name = L_REMOVE_OBJECT;

	this.object = object;

	this.parent = (object !== undefined) ? object.parent : undefined;

	if (this.parent !== undefined) {
		this.index = this.parent.children.indexOf(this.object);
	}
};

RemoveObjectCommand.prototype = Object.create(Command.prototype);

Object.assign(RemoveObjectCommand.prototype, {
	constructor: RemoveObjectCommand,

	execute: function () {
		var scope = this.editor;

		this.parent.remove(this.object);

		if (this.object === this.editor.selected) {
			this.editor.select(null);
		}

		app.call('objectRemoved', this, this.object);
		app.call('sceneGraphChanged', this);
	},

	undo: function () {
		var scope = this.editor;

		this.parent.children.splice(this.index, 0, this.object);
		this.object.parent = this.parent;
		this.editor.select(this.object);

		app.call('objectAdded', this, this.object);
		app.call('sceneGraphChanged', this);
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
