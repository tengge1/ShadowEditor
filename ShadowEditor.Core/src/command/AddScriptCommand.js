import Command from './Command';

/**
 * 添加脚本命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param object THREE.Object3D
 * @param script javascript object
 * @constructor
 */
var AddScriptCommand = function (object, script) {
	Command.call(this);

	this.type = 'AddScriptCommand';
	this.name = '添加脚本';

	this.object = object;
	this.script = script;
};

AddScriptCommand.prototype = Object.create(Command.prototype);

Object.assign(AddScriptCommand.prototype, {
	constructor: AddScriptCommand,

	execute: function () {
		if (this.editor.scripts[this.object.uuid] === undefined) {
			this.editor.scripts[this.object.uuid] = [];
		}

		this.editor.scripts[this.object.uuid].push(this.script);
		this.editor.app.call('scriptAdded', this, this.script);
	},

	undo: function () {
		if (this.editor.scripts[this.object.uuid] === undefined) return;

		var index = this.editor.scripts[this.object.uuid].indexOf(this.script);

		if (index !== - 1) {
			this.editor.scripts[this.object.uuid].splice(index, 1);
		}

		this.editor.app.call('scriptRemoved', this, this.script);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.script = this.script;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.script = json.script;
		this.object = this.editor.objectByUuid(json.objectUuid);
	}
});

export default AddScriptCommand;