import Command from './Command';

/**
 * 移除脚本命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param object THREE.Object3D
 * @param script javascript object
 * @constructor
 */
function RemoveScriptCommand(object, script) {
	Command.call(this);

	this.type = 'RemoveScriptCommand';
	this.name = _t('Remove Script');

	this.object = object;
	this.script = script;
	if (this.object && this.script) {
		this.index = this.editor.scripts[this.object.uuid].indexOf(this.script);
	}
}

RemoveScriptCommand.prototype = Object.create(Command.prototype);

Object.assign(RemoveScriptCommand.prototype, {
	constructor: RemoveScriptCommand,

	execute: function () {
		if (this.editor.scripts[this.object.uuid] === undefined) return;

		if (this.index !== - 1) {
			this.editor.scripts[this.object.uuid].splice(this.index, 1);
		}

		app.call('scriptRemoved', this, this.script);
	},

	undo: function () {
		if (this.editor.scripts[this.object.uuid] === undefined) {
			this.editor.scripts[this.object.uuid] = [];
		}

		this.editor.scripts[this.object.uuid].splice(this.index, 0, this.script);

		app.call('scriptAdded', this, this.script);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.script = this.script;
		output.index = this.index;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.script = json.script;
		this.index = json.index;
		this.object = this.editor.objectByUuid(json.objectUuid);
	}
});

export default RemoveScriptCommand;
