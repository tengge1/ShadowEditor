import Command from './Command';

/**
 * 添加物体命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 配置
 * @constructor
 */
function AddObjectCommand(object) {
	Command.call(this);

	this.type = 'AddObjectCommand';

	this.object = object;

	if (object !== undefined) {
		this.name = _t('Add Object') + object.name;
	}
}

AddObjectCommand.prototype = Object.create(Command.prototype);

Object.assign(AddObjectCommand.prototype, {
	constructor: AddObjectCommand,

	execute: function () {
		this.editor.addObject(this.object);
		this.editor.select(this.object);
	},

	undo: function () {
		this.editor.removeObject(this.object);
		this.editor.deselect();
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);
		output.object = this.object.toJSON();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.object.object.uuid);

		if (this.object === undefined) {
			var loader = new THREE.ObjectLoader();
			this.object = loader.parse(json.object);
		}
	}
});

export default AddObjectCommand;