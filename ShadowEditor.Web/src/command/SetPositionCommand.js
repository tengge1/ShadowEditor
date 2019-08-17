import Command from './Command';

/**
 * 设置位置命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param object THREE.Object3D
 * @param newPosition THREE.Vector3
 * @param optionalOldPosition THREE.Vector3
 * @constructor
 */
function SetPositionCommand(object, newPosition, optionalOldPosition) {
	Command.call(this);

	this.type = 'SetPositionCommand';
	this.name = _t('Set Position');
	this.updatable = true;

	this.object = object;

	if (object !== undefined && newPosition !== undefined) {
		this.oldPosition = object.position.clone();
		this.newPosition = newPosition.clone();
	}

	if (optionalOldPosition !== undefined) {
		this.oldPosition = optionalOldPosition.clone();
	}
};

SetPositionCommand.prototype = Object.create(Command.prototype);

Object.assign(SetPositionCommand.prototype, {
	constructor: SetPositionCommand,

	execute: function () {
		this.object.position.copy(this.newPosition);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	undo: function () {
		this.object.position.copy(this.oldPosition);
		this.object.updateMatrixWorld(true);
		app.call('objectChanged', this, this.object);
	},

	update: function (command) {
		this.newPosition.copy(command.newPosition);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldPosition = this.oldPosition.toArray();
		output.newPosition = this.newPosition.toArray();

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldPosition = new THREE.Vector3().fromArray(json.oldPosition);
		this.newPosition = new THREE.Vector3().fromArray(json.newPosition);
	}
});

export default SetPositionCommand;