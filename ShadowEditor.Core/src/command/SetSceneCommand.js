import Command from './Command';
import SetUuidCommand from './SetUuidCommand';
import SetValueCommand from './SetValueCommand';
import AddObjectCommand from './AddObjectCommand';

/**
 * 设置场景命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param scene containing children to import
 * @constructor
 */
function SetSceneCommand(scene) {
	Command.call(this);

	this.type = 'SetSceneCommand';
	this.name = '设置场景';

	this.cmdArray = [];

	if (scene !== undefined) {
		this.cmdArray.push(new SetUuidCommand(this.editor.scene, scene.uuid));
		this.cmdArray.push(new SetValueCommand(this.editor.scene, 'name', scene.name));
		this.cmdArray.push(new SetValueCommand(this.editor.scene, 'userData', JSON.parse(JSON.stringify(scene.userData))));

		while (scene.children.length > 0) {
			var child = scene.children.pop();
			this.cmdArray.push(new AddObjectCommand(child));
		}
	}
};

SetSceneCommand.prototype = Object.create(Command.prototype);

Object.assign(SetSceneCommand.prototype, {
	constructor: SetSceneCommand,

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

export default SetSceneCommand;
