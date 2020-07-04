/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 命令基类
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {*} editorRef pointer to main editor object used to initialize each command object with a reference to the editor
 * @constructor
 */
function Command(editorRef) {
    this.id = -1;
    this.inMemory = false;
    this.updatable = false;
    this.type = '';
    this.name = '';

    if (editorRef !== undefined) {
        Command.editor = editorRef;
    }
    this.editor = Command.editor;
}

Command.prototype.toJSON = function () {
    var output = {};
    output.type = this.type;
    output.id = this.id;
    output.name = this.name;
    return output;
};

Command.prototype.fromJSON = function (json) {
    this.inMemory = true;
    this.type = json.type;
    this.id = json.id;
    this.name = json.name;
};

export default Command;