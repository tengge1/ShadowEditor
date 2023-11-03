/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import Command from './Command';

/**
 * 添加物体命令
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 * @param {THREE.Object3D} object 配置
 * @constructor
 */
class AddObjectCommand extends Command {
  constructor(object) {
    super();
    this.type = 'AddObjectCommand';

    this.object = object;

    if (object !== undefined) {
      this.name = _t('Add Object') + object.name;
    }
  }

  execute() {
    this.editor.addObject(this.object);
    this.editor.select(this.object);
  }

  undo() {
    this.editor.removeObject(this.object);
    this.editor.deselect();
  }

  toJSON() {
    var output = Command.prototype.toJSON.call(this);
    output.object = this.object.toJSON();

    return output;
  }

  fromJSON(json) {
    Command.prototype.fromJSON.call(this, json);

    this.object = this.editor.objectByUuid(json.object.object.uuid);

    if (this.object === undefined) {
      var loader = new THREE.ObjectLoader();
      this.object = loader.parse(json.object);
    }
  }
}

export default AddObjectCommand;
