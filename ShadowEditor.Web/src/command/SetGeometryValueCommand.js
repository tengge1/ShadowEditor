import Command from './Command';

/**
 * 设置几何体值命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */
function SetGeometryValueCommand(object, attributeName, newValue) {
	Command.call(this);

	this.type = 'SetGeometryValueCommand';
	this.name = L_SET_GEOMETRY + '.' + attributeName;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = (object !== undefined) ? object.geometry[attributeName] : undefined;
	this.newValue = newValue;
};

SetGeometryValueCommand.prototype = Object.create(Command.prototype);

Object.assign(SetGeometryValueCommand.prototype, {
	constructor: SetGeometryValueCommand,

	execute: function () {
		this.object.geometry[this.attributeName] = this.newValue;
		this.editor.app.call('objectChanged', this, this.object);
		this.editor.app.call('geometryChanged', this);
		this.editor.app.call('sceneGraphChanged', this);
	},

	undo: function () {
		this.object.geometry[this.attributeName] = this.oldValue;
		this.editor.app.call('objectChanged', this, this.object);
		this.editor.app.call('geometryChanged', this);
		this.editor.app.call('sceneGraphChanged', this);
	},

	toJSON: function () {
		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;
	},

	fromJSON: function (json) {
		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
	}
});

export default SetGeometryValueCommand;