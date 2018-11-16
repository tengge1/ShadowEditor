import Command from './Command';

/**
 * 同时执行多种命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param cmdArray array containing command objects
 * @constructor
 */
function MultiCmdsCommand(cmdArray) {
	Command.call(this);

	this.type = 'MultiCmdsCommand';
	this.name = '多种改变';

	this.cmdArray = (cmdArray !== undefined) ? cmdArray : [];
};

MultiCmdsCommand.prototype = Object.create(Command.prototype);

Object.assign(MultiCmdsCommand.prototype, {
	constructor: MultiCmdsCommand,

	execute: function () {
		for (var i = 0; i < this.cmdArray.length; i++) {
			this.cmdArray[i].execute();
		}
		this.editor.app.call('sceneGraphChanged', this);
	},

	undo: function () {
		for (var i = this.cmdArray.length - 1; i >= 0; i--) {
			this.cmdArray[i].undo();
		}
		this.editor.app.call('sceneGraphChanged', this);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		var cmds = [];
		for (var i = 0; i < this.cmdArray.length; i++) {
			cmds.push(this.cmdArray[i].toJSON());
		}
		output.cmds = cmds;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		var cmds = json.cmds;
		for (var i = 0; i < cmds.length; i++) {
			var cmd = new window[cmds[i].type]();	// creates a new object of type "json.type"
			cmd.fromJSON(cmds[i]);
			this.cmdArray.push(cmd);
		}
	}
});

export default MultiCmdsCommand;
