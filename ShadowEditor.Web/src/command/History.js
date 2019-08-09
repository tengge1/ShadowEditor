import Command from './Command';

/**
 * 历史记录
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */
function History(editor) {
    this.editor = editor;
    this.undos = [];
    this.redos = [];
    this.lastCmdTime = new Date();
    this.idCounter = 0;

    Command.call(this, editor);
};

History.prototype = Object.create(Command.prototype);

Object.assign(History.prototype, {

    constructor: History,

    execute: function (cmd, optionalName) {

        var lastCmd = this.undos[this.undos.length - 1];
        var timeDifference = new Date().getTime() - this.lastCmdTime.getTime();

        var isUpdatableCmd = lastCmd &&
            lastCmd.updatable &&
            cmd.updatable &&
            lastCmd.object === cmd.object &&
            lastCmd.type === cmd.type &&
            lastCmd.script === cmd.script &&
            lastCmd.attributeName === cmd.attributeName;

        if (isUpdatableCmd && cmd.type === "SetScriptValueCommand") {

            // When the cmd.type is "SetScriptValueCommand" the timeDifference is ignored

            lastCmd.update(cmd);
            cmd = lastCmd;

        } else if (isUpdatableCmd && timeDifference < 500) {

            lastCmd.update(cmd);
            cmd = lastCmd;

        } else {

            // the command is not updatable and is added as a new part of the history

            this.undos.push(cmd);
            cmd.id = ++this.idCounter;

        }
        cmd.name = (optionalName !== undefined) ? optionalName : cmd.name;
        cmd.execute();
        cmd.inMemory = true;

        this.lastCmdTime = new Date();

        // clearing all the redo-commands

        this.redos = [];
        app.call('historyChanged', this, cmd);

    },

    undo: function () {
        var cmd = undefined;

        if (this.undos.length > 0) {
            cmd = this.undos.pop();

            if (cmd.inMemory === false) {
                cmd.fromJSON(cmd.json);
            }
        }

        if (cmd !== undefined) {
            cmd.undo();
            this.redos.push(cmd);
            app.call('historyChanged', this, cmd);
        }

        return cmd;
    },

    redo: function () {
        var cmd = undefined;

        if (this.redos.length > 0) {
            cmd = this.redos.pop();

            if (cmd.inMemory === false) {
                cmd.fromJSON(cmd.json);
            }
        }

        if (cmd !== undefined) {
            cmd.execute();
            this.undos.push(cmd);
            app.call('historyChanged', this, cmd);
        }

        return cmd;
    },

    toJSON: function () {
        var history = {};
        history.undos = [];
        history.redos = [];

        // Append Undos to History
        for (var i = 0; i < this.undos.length; i++) {
            if (this.undos[i].hasOwnProperty("json")) {
                history.undos.push(this.undos[i].json);
            }
        }

        // Append Redos to History
        for (var i = 0; i < this.redos.length; i++) {
            if (this.redos[i].hasOwnProperty("json")) {
                history.redos.push(this.redos[i].json);
            }
        }

        return history;
    },

    fromJSON: function (json) {
        if (json === undefined) return;

        for (var i = 0; i < json.undos.length; i++) {
            var cmdJSON = json.undos[i];
            var cmd = new window[cmdJSON.type](); // creates a new object of type "json.type"
            cmd.json = cmdJSON;
            cmd.id = cmdJSON.id;
            cmd.name = cmdJSON.name;
            this.undos.push(cmd);
            this.idCounter = (cmdJSON.id > this.idCounter) ? cmdJSON.id : this.idCounter; // set last used idCounter
        }

        for (var i = 0; i < json.redos.length; i++) {
            var cmdJSON = json.redos[i];
            var cmd = new window[cmdJSON.type](); // creates a new object of type "json.type"
            cmd.json = cmdJSON;
            cmd.id = cmdJSON.id;
            cmd.name = cmdJSON.name;
            this.redos.push(cmd);
            this.idCounter = (cmdJSON.id > this.idCounter) ? cmdJSON.id : this.idCounter; // set last used idCounter
        }

        // Select the last executed undo-command
        app.call('historyChanged', this, this.undos[this.undos.length - 1]);
    },

    clear: function () {
        this.undos = [];
        this.redos = [];
        this.idCounter = 0;

        app.call('historyChanged', this);
    },

    goToState: function (id) {
        var cmd = this.undos.length > 0 ? this.undos[this.undos.length - 1] : undefined; // next cmd to pop

        if (cmd === undefined || id > cmd.id) {
            cmd = this.redo();
            while (cmd !== undefined && id > cmd.id) {
                cmd = this.redo();
            }
        } else {
            while (true) {
                cmd = this.undos[this.undos.length - 1]; // next cmd to pop
                if (cmd === undefined || id === cmd.id) break;
                cmd = this.undo();
            }
        }
        
        app.call('historyChanged', this, cmd);
    },

    enableSerialization: function (id) {

        /**
         * because there might be commands in this.undos and this.redos
         * which have not been serialized with .toJSON() we go back
         * to the oldest command and redo one command after the other
         * while also calling .toJSON() on them.
         */

        this.goToState(-1);

        var cmd = this.redo();
        while (cmd !== undefined) {
            if (!cmd.hasOwnProperty("json")) {
                cmd.json = cmd.toJSON();
            }
            cmd = this.redo();
        }

        this.goToState(id);
    }
});

export default History;